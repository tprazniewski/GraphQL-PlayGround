import {GraphQLServer} from 'graphql-yoga'


//Type Definitions (schema) // Field(name of table) || Type is like a for example string
const typeDefs = `
    type Query {
        greeting(name: String, surname: String): String!
        me: User!
        post: Post!
    },

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    },
    type Post {
        id:ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

const resolvers = {
    Query: {    
        greeting(parent, args, ctx,info){ return `helllo ${args.name} ${args.surname} `},

        me() { 
            return {
                id: "1",
                name: "Tomasz PRazniewski",
                email: "tprazniewski@gmail.com",
                age: 33
            }
        },
        post() {
            return {
                id: "1",
                title: "First Poast ",
                body: " This is the first body section",
                published: false
            }
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
