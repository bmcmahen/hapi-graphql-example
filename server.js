import {Server} from 'hapi'
import schema from './schema'
import { graphql } from 'graphql'
import mongoose from 'mongoose'
import Boom from 'boom'

const server = new Server()

// connect to our mongodb
mongoose.connect('mongodb://localhost/graphql')

server.connection({
  host: 'localhost',
  port: 8000
})

server.route({
  method: 'GET',
  path: '/',
  handler: async (request, reply) => {
    return reply(
      `
        <html>
          <head>
            <title>Testing GraphQL and Hapi</title>
          </head>
          <body>
            <h1>Hello world.</h1>
            <p>Try posting queries and mutations</p>
            <p>The user name must contain 'ben'. It will 403 otherwise, to demonstrate some semblance of authorization</p>

            <form id='query'>
              <input type='text' name='id' placeholder='user id' />
              <button id='get-user' type='submit' style='margin-top: 15px;'>Query User</button>
            </form>
            <div id='query-result'>Result will show here</div>

            <form id='mutate' style='margin-top: 50px;'>
              <input type='text' name='id' placeholder='User id' />
              <input type='text' name='name' placeholder='User name' />
              <input type='submit' value='mutate user' />
            </form>
            <script src='/static/bundle.js'></script>
          </body>
        </html>
      `
    )
  }
})

server.route({
  method: 'POST',
  path: '/graphql',
  config: {
    payload: {
      allow: 'application/json'
    }
  },
  handler: async (request, reply) => {
    let {query, params} = request.payload
    let fakeSession = {
      name: 'ben'
    }

    try {
      let result = await graphql(schema, query, fakeSession, params)

      // not really sure how best to handle errors because, on the one
      // hand you should be able to make multiple queries -- some may success,
      // while others may fail. Hrmph.

      if (result.errors) {

        if (result.errors[0].message === '403') {
          return reply(Boom.forbidden(result.errors))
        }

        return reply(Boom.badRequest(result.errors))
      }
      return reply(result)
    } catch(err) {
      console.error('Error caught', err)
      reply(Boom.wrap(err))
    }
  }
})

server.route({
  method: 'GET',
  path: '/static/bundle.js',
  handler: (request, reply) => {
    reply.file('static/bundle.js')
  }
})

server.start(() => console.log('Hapi running on port 8000'))
