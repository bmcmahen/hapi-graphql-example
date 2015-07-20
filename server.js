import {Server} from 'hapi'
import schema from './schema'
import { graphql } from 'graphql'

const server = new Server()

server.connection({
  host: 'localhost',
  port: 8000
})


server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('hello world')
  }
})

server.route({
  method: 'POST',
  path: '/graphql',
  config: {
    payload: {
      parse: false,
      allow: 'application/graphql'
    }
  },
  handler: (request, reply) => {
    graphql(schema, request.payload)
      .then(result => {
        reply(JSON.stringify(result, null, 2))
      })
      .catch(err => {
        reply(err)
      })
  }
})

server.start()
