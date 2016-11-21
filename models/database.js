const pgp = require( 'pg-promise' )()
const db = pgp({database: 'tdd'})

const resetDB = () => {
  return Promise.all(
    [
      db.query('delete from books'),
      db.query('delete from authors'),
      db.query('delete from genres'),
      db.query('delete from book_authors'),
      db.query('delete from book_genres')
    ]
  )
}

const insertBook = (title, year) => {
  return db.query( 'INSERT INTO books(title, year) values($1, $2) RETURNING id', [title, year])
    .then( result => result[0].id)
}

const insertAuthor = author => {
  return db.query( 'INSERT INTO authors( name ) values( $1 ) RETURNING id', [author]).then( result => result[0].id)
}

const insertGenre = genre => {
  return db.query( 'INSERT INTO genres( name ) values( $1 ) RETURNING id', [genre]).then( result => result[0].id)
}

const joinAuthorsToBook = (bookId, authorId) => {
  return db.query( 'INSERT INTO book_authors( bookId, authorId ) values ($1, $2)').then( result => result[0].id)
}

const joinGenresToBook = (bookId, genreId) => {
  return db.query( 'INSERT INTO book_genres( bookId, genreId ) values( $1, $2)  RETURNING id', [ bookId, genreId]).then( result => result[0].id)
}

const createBook = book => {
  return Promise.all( [
    insertBook(book.title, book.year),
    insertAuthor(book.author),
    Promise.all(
      book.genres.sort().map(genre => {
        return insertGenre(genre)
      })
    )
  ]).then( results => {
     bookId = results[0],
     authorId = results[1],
     genreId = results[2]

    joinAuthorsToBook(bookId, genreId)

    genreId.forEach(genreId => {
      joinGenresToBook(bookId, genreId)
    })
    book.id = bookId
    return book
  })
}

// const showBooks = books => {
//   return db.query( 'SELECT * FROM books', [ bookId, genreId]).then( result => result[0].id)
// }


module.exports = {
  resetDB,
  createBook
}
