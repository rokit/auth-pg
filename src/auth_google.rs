use failure::Error;
use jsonwebtoken as jwt;
use jwt::errors::ErrorKind;
use jwt::{decode, encode, Algorithm, Validation};
use reqwest;
use serde_json::value::Value::String as SerdeString;
use std::sync::Arc;
use std::collections::HashSet;

#[derive(Clone)]
pub struct GoogleSignin {
    client: Arc<reqwest::Client>,
    secret: String,
}

#[derive(Deserialize, Debug)]
struct JWK {
    alg: String,
    n: String,
    kid: String,
    e: String,
    kty: String,
    r#use: String,
}

#[derive(Deserialize, Debug)]
struct Certs {
    keys: Vec<JWK>,
}

#[derive(Deserialize, Debug)]
struct Header {
    alg: String,
    kid: String,
    typ: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct GooglePayload {
    iss: String,
    azp: String,
    aud: String,
    sub: String,
    email: String,
    email_verified: bool,
    at_hash: String,
    name: String,
    picture: String,
    given_name: String,
    family_name: String,
    locale: String,
    iat: u32,
    exp: u32,
    jti: String,
}

impl GoogleSignin {
    pub fn new(secret: &str) -> GoogleSignin {
        GoogleSignin {
            client: Arc::new(reqwest::Client::new()),
            secret: secret.to_owned(),
        }
    }

    fn get_certs(&self) -> reqwest::Result<Certs> {
        let url = "https://www.googleapis.com/oauth2/v3/certs";
        let json = self.client.get(url).send()?.json();
        // println!("get_certs json: {:?}", json);
        json
    }

    pub fn is_valid_token(&self, token: &str) -> Result<bool, failure::Error> {
        let certs: Certs = self.get_certs()?;

        let claimed_kid = jwt::decode_header(&token)?.kid.unwrap_or_default();
        let mut e = "";
        let mut n = "";

        let mut b_match = false;
        for key in &certs.keys {
            if key.kid == claimed_kid {
                b_match = true;
                n = &key.n;
                e = &key.e;
                break;
            }
        }

        if !b_match {
            println!("kid does not match any google kid");
            return Err(failure::err_msg("Token is invalid".to_string()));
        }

        let aud = 
            "131808800218-t958n7gtqll3tkctopu8245846ovfg8m.apps.googleusercontent.com".to_string();
        // let mut aud_hashset = HashSet::new();
        // aud_hashset.insert(aud);
        let validation = Validation {
            leeway: 10,
            algorithms: vec![Algorithm::RS256],
            ..Validation::default()
        };

        let token_data = jwt::decode_rsa_components::<GooglePayload>(&token, &n, &e, &validation)?;

        if !(token_data.claims.aud == aud) {
            println!("google authentication: aud (audience) did not match");
            return Ok(false);
        }
        if !(token_data.claims.iss == "accounts.google.com") {
            println!("google authentication: iss (issuer) did not match");
            return Ok(false);
        }

        Ok(true)
    }
}
