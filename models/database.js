const pgp = require( 'pg-promise' )()
const db = pgp({database: 'tdd'})

const resetDb = () => {
  return Promise.all([
    db.query('delete from books'),
    db.query('delete from authors'),
    db.query('delete from genres'),
    db.query('delete from book_authors'),
    db.query('delete from book_genres')
  ])
}

const insertBook = (title, year) => {
  return db.query( 'INSERT INTO books( title, year ) values( $1, $2 ) RETURNING id', [ title, year ])
    .then( result => result[0].id)
}

const insertAuthor = author => {
  return db.query( 'INSERT INTO authors( name ) values( $1 ) RETURNING id', [author]).then( result => result[0].id)
}

const insertGenre = genre => {
  return db.query( 'INSERT INTO genres( name ) values( $1 ) RETURNING id', [genre]).then( result => result[0].id)
}

const joinAuthorsToBook = (bookId, authorId) => {
  return db.query( 'INSERT INTO book_authors( book_id, author_id ) values ($1, $2)', [ bookId, authorId])
}

const joinGenresToBook = (bookId, genreId) => {
  return db.query( 'INSERT INTO book_genres( book_id, genre_id ) values( $1, $2)', [ bookId, genreId])
}

const createBook = book => {
  return Promise.all([
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

    joinAuthorsToBook(bookId, authorId)

    genreId.forEach(genreId => {
      joinGenresToBook(bookId, genreId)
    })
    book.id = bookId
    return book
  })
}

const showBooks = (page = 1) => {
  const offset = (page - 1) * 10
  return db.query( `
    SELECT books.id,
      books.title,
      books.year,
      authors.name as author,
      json_agg(genres.name order by genres.name asc) as genres
    FROM books
      join book_genres on books.id = book_genres.book_id
      join genres on book_genres.genre_id = genres.id
      join book_authors on books.id = book_authors.book_id
      join authors on book_authors.author_id = authors.id
    group by books.id, title, year, author
    LIMIT 10 offset $1
  `, [offset])
}

const search = {
  forBooks: options => {
   const variables = []
   let sql = `SELECT DISTINCT(books.*) FROM books`

   if (options.search_query){
     let search_query = options.search_query
       .toLowerCase()
       .replace(/^ */, '%')
       .replace(/ *$/, '%')
       .replace(/ +/g, '%')

     variables.push(search_query)
     sql += `
     LEFT JOIN book_authors ON books.id=book_authors.book_id
     LEFT JOIN authors ON authors.id=book_authors.author_id
     LEFT JOIN book_genres ON books.id=book_genres.book_id
     LEFT JOIN genres ON genres.id=book_genres.genre_id
     WHERE LOWER(books.title) LIKE $${variables.length}
     OR LOWER(authors.name) LIKE $${variables.length}
     OR LOWER(genres.title) LIKE $${variables.length}
     ORDER BY books.id ASC
     `
   }

   if (options.page){
     let PAGE_SIZE = parseInt( options.size || 10 )
     let offset = (parseInt(options.page) - 1) * PAGE_SIZE
     variables.push(offset)
     sql += `
     LIMIT ${PAGE_SIZE}
     OFFSET $${variables.length}
     `
   }

   return db.any(sql, variables)
 }
}

module.exports = {
  resetDb,
  createBook,
  showBooks,
  search
}
