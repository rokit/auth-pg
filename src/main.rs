use actix_files as fs;
use actix_web::{guard, http, middleware, web, App, HttpRequest, HttpResponse, HttpServer};
use failure::Error;
use futures::Future;
use r2d2_postgres::r2d2;
use r2d2_postgres::PostgresConnectionManager;
use serde::{Deserialize, Serialize};
use serde_json;
use std::env;

fn p404() -> Result<fs::NamedFile, Error> {
    Ok(fs::NamedFile::open("static/404.html")?.set_status_code(http::StatusCode::NOT_FOUND))
}

fn get_server_port() -> u16 {
    env::var("PORT")
        .unwrap_or_else(|_| 5000.to_string())
        .parse()
        .expect("PORT must be a number")
}

#[derive(Serialize, Deserialize)]
struct User {
    id: Option<i32>,
    email: String,
    username: String,
    pw: String,
}

impl User {
    fn is_valid(&self) -> bool {
        if self.username == "" {
            return false;
        }
        if self.email == "" {
            return false;
        }
        if self.pw == "" {
            return false;
        }
        return true;
    }
}

fn get_users(
    pool: web::Data<r2d2::Pool<PostgresConnectionManager>>,
) -> impl Future<Item = HttpResponse, Error = actix_web::Error> {
    actix_web::web::block(move || {
        let mut users: Vec<String> = Vec::new();

        let conn = pool.get()?;
        for row in &conn.query("SELECT username FROM users;", &[])? {
            let username: String = row.get(0);
            users.push(username);
        }

        if users.is_empty() {
            Err(failure::err_msg("Nahhhhhhh".to_owned()))
        } else {
            let json_users = serde_json::to_string(&users)?;
            Ok(json_users)
        }
    })
    .map_err(|err| {
        println!("get_users: {}", err);
        actix_web::Error::from(failure::err_msg("No results".to_owned()))
    })
    .and_then(|res| {
        HttpResponse::Ok()
            .content_type("application/json")
            .body(res.to_owned())
    })
}

fn add_user(
    req: HttpRequest,
    user: web::Json<User>,
    pool: web::Data<r2d2::Pool<PostgresConnectionManager>>,
) -> impl Future<Item = HttpResponse, Error = actix_web::Error> {
    actix_web::web::block(move || {
        if !user.is_valid() {
            return Err(failure::err_msg("User not valid".to_string()));
        }

        let conn = pool.get()?;
        let rows_updated = conn.execute(
            "INSERT INTO users (email, username, pw) VALUES ($1, $2, $3)",
            &[&user.email, &user.username, &user.pw],
        );

        match rows_updated {
            Ok(num) => Ok(num),
            Err(err) => Err(failure::err_msg(err.to_string())),
        }
    })
    .map_err(|err| {
        println!("add_user: {}", err);
        let json_error = serde_json::to_string("0").unwrap();
        actix_web::Error::from(failure::err_msg(json_error))
    })
    .and_then(|res| {
        let res_json = serde_json::to_string(&res.to_owned()).unwrap_or("".to_owned());
        HttpResponse::Ok()
            .content_type("application/json")
            .body(res_json)
    })
}

fn main() {
    let database_url = env::var("STORYDB_URL").expect("the database url must be set");
    let manager =
        PostgresConnectionManager::new(database_url, r2d2_postgres::TlsMode::None).unwrap();
    let pool = r2d2::Pool::new(manager).unwrap();

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .wrap(middleware::Logger::default())
            .service(
                web::scope("/story")
                    // .default_service(web::get().to_async(unsplash_get))
                    .route("/get-users", web::get().to_async(get_users))
                    .route("/add-user", web::post().to_async(add_user)),
            )
            .service(fs::Files::new("/", "static/build").index_file("index.html"))
            .default_service(
                // 404 for GET request
                web::resource("")
                    .route(web::get().to(p404))
                    // all requests that are not GET
                    .route(
                        web::route()
                            .guard(guard::Not(guard::Get()))
                            .to(HttpResponse::MethodNotAllowed),
                    ),
            )
    })
    .bind(("0.0.0.0", get_server_port()))
    .unwrap()
    .run()
    .unwrap();
}
