import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from "graphql";

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    cursorForObjectInConnection,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
    toGlobalId
} from "graphql-relay";

// import {
// import db operations
// } from "./database";

// get node interface and field from relay lib

// nodeInterface defines the way you resolve an ID to it's matching object(search DB by ID)
// nodeField defines the way you resolve a node object to it's matching GraphQL type(match case)
// nodeDefinitions methods that map node ID back to the correct database object which you can then return
const { nodeInterface, nodeField } = nodeDefinitions(
    globalId => {
        const { type, id } = fromGlobalId(globalId);
        if (type === "Todo") {
            return getTodo();
        } else {
            return null;
        }
        // resolve globalId to db match
    },
    obj => {
        // return matching object type
        if (obj.todos) {
            return userType;
        } else if (obj.text) {
            return todoType;
        } else {
            return null;
        }
    }
);

const todoType = new GraphQLObjectType({
    name: "Todo",
    description: "Something that needs to be done",
    fields: () => ({
        id: globalIdField("Todo"),
        name: {
            type: GraphQLString,
            description: "Optional description..."
        }
    }),
    interfaces: [nodeInterface]
});

// define a connection between an object and it's children (eg. a user and it's todos)
// connectionType has an edges field which contains cursor and a todo node

const {
    connectionType: todoConnection, // Name/Call the connection
    edgeType: TodoEdge // Name the edge
} = connectionDefinitions({ name: "Todo", nodeType: todoType }); // Name connection ande node + select node

// user type
const userType = new GraphQLObjectType({
    name: "User",
    description: "A user of the application",
    fields: () => ({
        id: globalIdField("User"),
        userId: {
            type: GraphQLString,
            description: "id of user in db",
            resolve: user => user.id
        },
        name: {
            type: GraphQLString,
            description: "Name of the user"
        },
        todos: {
            type: todoConnection,
            description: "Todos listed under the user",
            args: connectionArgs,
            resolve: (
                user, // user is root
                args // connectionArgs are pagination Arguements (eg. first 2)
            ) => connectionFromArray(user.todos.map(id => getTodo(id)), args)
        }
    }),
    interfaces: [nodeInterface]
});

// root query type
// schema entry point
const Query = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        node: nodeField,
        users: {
            type: new GraphQLList(userType),
            args: {
                names: {
                    type: new GraphQLList(GraphQLString)
                }
            },
            resolve: (root, { names }) => getUsers(names)
        },
        todos: {
            type: new GraphQLList(todoType),
            args: {
                usernId: { type: GraphQLString }
            },
            resolve: (root, { userId }) => getTodos(userId) // todos are sorted under userId
        }
    })
});

const todoMutation = mutationWithClientMutationId({
    name: "AddTodo",
    inputFields: {
        todoName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        userId: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    outputFields: {
        newTodoEdge: {
            type: TodoEdge,
            resolve: ({ todoId, userId }) => {
                const todo = getTodo(todoId); // get returned id from payload func
                return {
                    cursor: cursorForObjectInConnection(
                        getTodos(userId), // get all todos by userId and return them
                        todo // new todo
                    ),
                    node: todo // node is the new todo
                };
            }
        },
        user: {
            type: userType,
            resolve: ({ userId }) => getUser(userId) // get user by id from db
        }
    },
    // ran after mutate finished properly
    mutateAndGetPayload: payload => {
        const newTodo = createTodo(payload.todoName, payload.userId);
        return {
            todoId: newTodo.id, // return todoid in payload
            userId: payload.userId // return userId in payload
        };
    }
});

// root mutation type
// entry point for performing writes into schema
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    description: "...", // optional
    fields: () => ({
        // pass all mutations here
        addTodo: todoMutation
    })
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});
