import {GraphQLServer} from 'graphql-yoga'


//Type Definitions (schema) // Field(name of table) || Type is like a for example string
const typeDefs = `
    type Query {
        greeting(name: String, surname: String): String!
        sum(num1: Int!, num2: Int!): Int!
        add(numbers: [Int!]): Int!
        grades:[Int!]!
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
        add(parent,args,ctx,info) {
            if(args.numbers.length === 0){
                return 0
            }
            return args.numbers.reduce((acc,cur) => acc+cur)
        },   
        sum(parent, args, ctx,info)  { return args.num1 + args.num2},
        greeting(parent, args, ctx,info){ return `helllo ${args.name} ${args.surname} `},
        grades(parent,args,ctx,info) {
            return [1,2,3,4,5,6,7,8,9]
        },
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
