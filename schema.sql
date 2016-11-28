DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  year INTEGER
);

DROP TABLE IF EXISTS authors;
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

DROP TABLE IF EXISTS genres;
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

DROP TABLE IF EXISTS book_authors;
CREATE TABLE book_authors (
  book_id INTEGER,
  author_id INTEGER
);

DROP TABLE IF EXISTS book_genres;
CREATE TABLE book_genres (
  book_id INTEGER,
  genre_id INTEGER
);
