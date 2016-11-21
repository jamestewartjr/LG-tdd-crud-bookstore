const express = require('express')

const server = express()

server.set('port', process.env.PORT || '3000')

server.get('/ping', (request, response, next) => {
  response.send('pong')
})

server.post('api/test/reset-db', (request, response) => {
  response.json('pong')
})

if (process.env.NODE_ENV !== 'test'){
  server.listen(server.get('port'))
}

module.exports = server
