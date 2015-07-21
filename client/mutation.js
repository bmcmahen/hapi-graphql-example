import request from 'superagent'
import Debug from 'debug'

let log = new Debug('client:mutation')

export default function mutateHuman (id, name, fn) {

  let query = `
     mutation updateHuman($id: String! $name: String!) {
       updateHuman(id: $id name: $name) {
         name
       }
     }
    `

  let params = {
    id: id,
    name: name
  }

  log('mutation query %s, params: %o', query, params)

  request
    .post('/graphql')
    .send({ query, params })
    .end((err, res) => {
      log(err || res.body)
      if (fn) fn(err, res)
    })

}
