const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

// 2 resolver has same structure as typeDefs, type Query => resolver Query
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (_, args) => {
      return links.filter((l) => l.id == args.id)[0];
    },
  },
  Mutation: {
    post: (_, args) => {
      let idCount = links.length;

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (_, { id, url, description }) => {
      let toUpdate = links.find((l) => l.id == id);
      toUpdate.url = url == null ? toUpdate.url : url;
      toUpdate.description = description == null ? toUpdate.description : description;
      return toUpdate;
    },
    deleteLink: (_, { id }) => {
      let toDelete = links.filter((l) => l.id == id);
      if (toDelete.length != 0) {
        links = links.filter((l) => l.id != id);
        return true;
      }
      return false;
    },
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
};

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
