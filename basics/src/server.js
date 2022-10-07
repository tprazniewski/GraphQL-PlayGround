import {GraphQLServer} from 'graphql-yoga'


//Type Definitions (schema) // Field(name of table) || Type is like a for example string
const typeDefs = `
    type Query {
        me: User!


        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
    },

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`


//Resolvers // set of functions

const resolvers = {
    Query: {    // not sure but probably type from the def types and resolvers need to match

        me() { 
            return {
                id: "1",
                name: "Tomasz PRazniewski",
                email: "tprazniewski@gmail.com",
                age: 33
            }
        },




        id() {
            return '1'
        },
        name() {
            return 'Tomasz Prazniewski'
        },
        age() {
            return 33
        },
        employed() {
            return false
        }
    }
}

// const server =  new GraphQLServer({
//     typeDefs: typeDefs,
//     resolvers: resolvers
// });
const server = new GraphQLServer({ typeDefs, resolvers })




server.start(()=>{
    console.log("the server is up and running ")
})
