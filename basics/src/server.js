import {GraphQLServer} from 'graphql-yoga'
import { uuid } from 'uuidv4';

const rdmNumber = (array) => {
    return array[array.length-1].id+1   
    
}

const comments = [
    {
        id: 1,
        text: "This is a first comment",
        author: 3,
        post: 1
    },
    {
        id: 2,
        text: "This is a second comment",
        author: 2,
        post: 3
    },
    {
        id: 3,
        text: "This is a third  text",
        author: 1,
        post: 3
    },
    {
        id: 4,
        text: "This is a fourth text",
        author: 3,
        post: 1
        
    }
]

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
        id: 3,
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
        published: true,
        author: 3
    },
    {
        id:2,
        title: "second title",
        body: "second Body text",
        published: true,
        author: 3
    },
    {
        id:3,
        title: "Third title",
        body: "Third Body text",
        published: false,
        author: 1
    },
]

//Type Definitions (schema) // Field(name of table) || Type is like a for example string
const typeDefs = `
    type Query {
        users(nameFiltr:String): [User!]!
        posts(titleBodyFiltr:String): [Post!]!
        me: User!
        post: Post!
        comments: [Comment!]!


        greeting(name: String, surname: String): String!
        sum(num1: Int!, num2: Int!): Int!
        add(numbers: [Int!]): Int!
        grades:[Int!]!  
    },
    
    type Mutation {
        createUser(data: CreateUserInput): User!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!

    }, 
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title:String!
        body:String!
        published: Boolean
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    },
    type Post {
        id:ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!

    },
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
        
    }
`

const resolvers = {
    Query: {
        comments(parent,argx,ctx,info) {
            return comments
        },
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

    },
    Mutation: {
        createUser(parent,args,ctx,info) {
            const emailTaken = users.some((user)=> user.email === args.data.email )

            if(emailTaken) throw new Error('Email is taken')
            const user = {
                id: rdmNumber(users),
                ...args.data
            }
            console.log(user)
            users.push(user)
            return user
        },
        createPost(parent,args,ctx,info){
            args.data.author = Number(args.data.author)

            const userExists = users.some((user) => user.id == args.data.author )
            if(!userExists) throw new Error(`This user doesn't exist`)

            const post = {
                id: rdmNumber(posts),
                ...args.data
            }
            posts.push(post)
            return post
        },
        createComment(parent,args,ctx,info) {

            const userExists = users.some((user)=> user.id == args.data.author)
            const postExists = posts.some((post) => post.id == args.data.post && post.published)
 
            if(!userExists || !postExists) throw new Error('unable to find user and post')

            const comment = {
                id: rdmNumber(comments),
                text: args.data.text,
                author: Number(args.data.author),
                post: Number(args.data.post)
            }
            comments.push(comment)
            return comment
        }
    },

    Post: {
        author(parent,args,ctx,info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment) => {
               return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent,args,ctx,info) {
            return posts.filter((post) => post.author=== parent.id)
        },
        comments(parent,args,ctx,info) {
            return comments.filter((comment) => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent,args,ctx,info) {
            return users.find((user) => {
                return user.id=== parent.author
            })
        },
        post(parent,argx,ctx,info) {
            return posts.find((post) => {
                console.log(post.id, parent.post)
                return post.id === parent.post
            })
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
