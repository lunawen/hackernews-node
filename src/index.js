const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");
const Subscription = require("./resolvers/Subscription");
const { PubSub } = require("graphql-subscriptions");

const prisma = new PrismaClient();
const pubSub = new PubSub();

// 2 resolver has same structure as typeDefs, type Query => resolver Query
const resolvers = {
  Query,
  Mutation,
  Link,
  User,
  Subscription,
};

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  // Instead of attaching an object directly, you’re now creating the context as a function which returns the context.
  // The advantage of this approach is that you can attach the HTTP request that carries the incoming GraphQL query (or mutation) to the context as well.
  // This will allow your resolvers to read the Authorization header and validate if the user who submitted the request is eligible to perform the requested operation.
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubSub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
