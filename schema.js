import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLInterfaceType
} from 'graphql/lib/type'
import Boom from 'boom'

import Human from './human'

/**
 * interface Character {
 * 	id: String
 * 	name: String
 * }
 *
 * Human type
 *
 * type Human : Characer {
 * 	id: String! (non-null)
 * 	name: String
 * 	email: String,
 * 	tags: [Tags]
 * }
 *
 * enum Tags { COOL, SILLY, STUPID }
 *
 * An entry point into the type system:
 *
 * type Query {
 * 	human(id: String!): Human
 * }
 *
 */

// this is only needed when we have types that interface
// from the same content -- in our case, we are just doing this
// for show
var characterInterface = new GraphQLInterfaceType({
  name: 'Character',
  description: 'A character in the Star Wars Trilogy',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the character'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the character'
    }
  }),
  resolveType: (obj) => {
    console.log('resolve type %o', obj)
    return humanType
  }
})

var humanType = new GraphQLObjectType({
  name: 'Human',
  description: 'A humanoid creature in the Star Wars Universe',
  interfaces: [characterInterface],
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The id of the human'
      },
      name: {
        type: GraphQLString,
        description: 'The name of the human',
        resolve: (me) => {
          return me.name + ' is my name'
        }
      },
      email: {
        type: GraphQLString,
        description: 'The email of the human',
        resolve: (me) => {
          // we can create 'virtual' fields incredibly easily.
          return me.name + '.mcmahen@gmail.com'
        }
      }
    }
  }
})


var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => {
    return {
      human: {
        type: humanType,
        args: {
          id: {
            description: 'id of the human',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (root, {id}, source, fieldASTs) => {
          var projections = getProjection(fieldASTs)
          console.log('resolve human query with projection %o', projections)
          return Human.findById(id, projections)
        }
      }
    }
  }
})

// determine fields to include in query.
// xxx not sure exactly how this works
function getProjection (fieldASTs) {
  return fieldASTs.selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = 1
    return projections
  }, {})
}

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => {
    return {
      updateHuman: {
        type: humanType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            name: 'name',
            type: GraphQLString
          }
        },

        resolve: (obj, {id, name}, session, fieldASTs) => {
          // let's only allow the user to be updated if it includes
          // the name 'ben'

          var projections = getProjection(fieldASTs)

          if (~name.indexOf(session.name)) {
            return Human
              .update({ _id: id }, {$set: { name: name }})
              .then(() => {
                return Human.findById(id, projections)
              })
          }

          return Promise.reject(403)

        }
      }
    }
  }
})

export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})
