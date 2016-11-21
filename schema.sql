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
  bookId INTEGER,
  authorId INTEGER 
);

DROP TABLE IF EXISTS book_genres;
CREATE TABLE book_genres (
  bookId INTEGER,
  genreId INTEGER
)
