const express = require('express')
const server = express()
const database = require('../models/database.js')
const bodyParser = require('body-parser')

server.set('port', process.env.PORT || '3000')

server.use(bodyParser.json())

server.get('/ping', (request, response, next) => {
  response.send('pong')
})

server.post('/api/test/reset-db', (request, response) => {
  database.resetDb().then(() => {
    response.status(200).end()
  })
})

server.post('/api/books', (request, response) => {
  if (request.body.hasOwnProperty("title")) {
    database.createBook(request.body).then( book => {
      response.status(201).json(book)
    })
  } else
    response.status(400).json( {
      error: {
        message: 'title cannot be blank'
      }
    })
})

server.get('/api/books', (request, response, next) => {
  let {query}  = request
  let page = query.page || 1
  let size = query.size || 10

  console.log("page", page)
  console.log("size", size)
  console.log("query", query)
  console.log("search query", query.search_query)

  if( query.search_query === undefined ) {
    database.showBooks(page).then( (books, page) => {
      response.status(200).json(books)
    })
  } else {
    database.search.forBooks({ page, size, search_query: query.search_query })
      .then( books => response.json( { books, page, size, search_query }) )
  }
})



server.get('/api/authors', (request, response) => {
  let page = 1
  database.getAuthors(page).then( (authors) => {
      response.status(200).json({authors, page})
  })
})
//
// server.get('/api/genres', (request, response) => {
//   response.status(200).json()
// })
//
// server.get('/api/books/:book_id', (request, response) => {
//   let {book_id} = request.body
//   // database.FUNCTIONHERE().then()
//   response.status(200).json()
// })
//
// server.post('/api/books/:book_id', (request, response) => {
//   response.status(200).json()
// })
//
// server.post('/api/books/:book_id/delete', (request, response) => {
//
// })






if (process.env.NODE_ENV !== 'test'){
  server.listen(server.get('port'))
}

module.exports = server
