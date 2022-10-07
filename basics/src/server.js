import {GraphQLServer} from 'graphql-yoga'


const users = [
    {
        id: 1,
        name: 'Tomasz',
        email: "Prazniewski@wp.pl",
        age: 33
    },
    {
        id: 2,
        name: 'Rob',
        email: "robcio@wp.pl",
        age: 22
    },
    {
        id: 1,
        name: 'Michal',
        email: "Mich@wp.pl",
        age: 28
    },
]

const posts = [
    {
        id:1,
        title: "First title",
        body: "First  text",
        published: false
    },
    {
        id:2,
        title: "second title",
        body: "second Body text",
        published: true
    },
    {
        id:3,
        title: "Third title",
        body: "Third Body text",
        published: false
    },
]

//Type Definitions (schema) // Field(name of table) || Type is like a for example string
const typeDefs = `
    type Query {
        users(nameFiltr:String): [User!]!
        posts(titleBodyFiltr:String): [Post!]!
        me: User!
        post: Post!


        greeting(name: String, surname: String): String!
        sum(num1: Int!, num2: Int!): Int!
        add(numbers: [Int!]): Int!
        grades:[Int!]!  
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
        posts(parent,args,ctx,info) {
            if(!args.titleBodyFiltr){
                return posts
            }
            return posts.filter((post) => {
                const isTitleMatch = post.title.toLocaleLowerCase().includes(args.titleBodyFiltr.toLowerCase())
                const isBodyMatch = post.body.toLocaleLowerCase().includes(args.titleBodyFiltr.toLowerCase())
                return isTitleMatch || isBodyMatch
            }
            )
        },
        users(parent,args,ctx,info) { 
            if(!args.nameFiltr){
                return users 
            }
            return users.filter((user) => user.name.toLocaleLowerCase().includes(args.nameFiltr.toLocaleLowerCase()))
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
        },



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
