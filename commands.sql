drop table if exists users;
create table users (
    id serial primary key,
    email text not null,
    username text not null,
    pw text not null
);

insert into users (email, username, pw) values
('goodvibrato@gmail.com', 'a', 'asdf'),
('goodvibrato@swbell.net', 'b', 'asdf');