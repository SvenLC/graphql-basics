import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
    type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    title() {
      return 'Le seigneur des anneaux';
    },
    price() {
      return 25.5;
    },
    releaseYear() {
      return 1980;
    },
    rating() {
      return 5;
    },
    inStock() {
      return true;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up!');
});
