import request from 'superagent'
import Debug from 'debug'

let log = new Debug('client:query')

export default function getUser(id, fn) {
  request
    .post('/graphql')
    .send({
      query: `{
        human(id: "${id}") {
          name
          email
        }
      }`
    })
    .end((err, res) => {
      log(err || res.body)
      if (fn) fn(err, res)
    })
}
