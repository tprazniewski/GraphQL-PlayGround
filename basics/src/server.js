import {GraphQLServer} from 'graphql-yoga'


//Type Definitions (schema) // Field(name of table) || Type is like a for example string
const typeDefs = `
    type Query {
        hello: String
        name: String
    }
`


//Resolvers // set of functions

const resolvers = {
    Query: {    // not sure but probably type from the def types and resolvers need to match
        hello(){ // the name from the def types and resolvers need to match
            return 'Welcome today we gonan learn some graphQL'
        } ,
        name(){
            return 'Tomasz Prazniewski'
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
