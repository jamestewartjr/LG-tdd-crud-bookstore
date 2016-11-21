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
  database.resetDB().then( () => {
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




if (process.env.NODE_ENV !== 'test'){
  server.listen(server.get('port'))
}

module.exports = server
