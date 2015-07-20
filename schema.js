import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt
} from 'graphql/lib/type'

let count = 0

let schema = new GraphQLSchema({

  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      count: {
        type: GraphQLInt,
        description: 'The count total',
        resolve: () => count
      }
    }
  }),

  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      updateCount: {
        type: GraphQLInt,
        description: 'Updates the count total',
        resolve: () => {
          count += 1
          return count
        }
      }
    }
  })
})

export default schema
