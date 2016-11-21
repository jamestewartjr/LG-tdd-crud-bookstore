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


module.exports = {
  resetDB,
}
