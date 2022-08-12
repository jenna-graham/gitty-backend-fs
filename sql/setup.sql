-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS github_user;
DROP TABLE IF EXISTS new_post;

CREATE TABLE github_user (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT,
    avatar TEXT
);

CREATE TABLE new_post (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    post TEXT NOT NULL
);

INSERT INTO new_post (title, post) VALUES 
('Hello', 'I am new to SQL PLEASE HELP!')