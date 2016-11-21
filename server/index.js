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

if (process.env.NODE_ENV !== 'test'){
  server.listen(server.get('port'))
}

module.exports = server
