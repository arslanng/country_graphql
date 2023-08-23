import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { countries, languages, continents } from "./data.js";

const typeDefs = `#graphql
    type Country {
        awsRegion: String!
        capital: String
        code: ID!
        continent: Continent
        currencies: [String!]!
        currency: String
        emoji: String!
        emojiU: String!
        languages: [Language!]!
        name: String!
        native: String!
        phone: String!
        phones: [String!]!
    }

    type Language {
        code: ID!
        name: String!
        native: String!
        rtl: Boolean!
    }

    type Continent {
        code: ID!
        countries: [Country!]!
        name: String!
    }

    type Query {
        countries: [Country!]!
        country(code: ID!): Country!

        languages: [Language!]!
        language(code: ID!): Language!

        continents: [Continent!]!
        continent(code: ID!): Continent!
    }
`;
const resolvers = {
  Query: {
    countries: () => countries,
    country: (_, args) => {
      const data = countries.find((country) => country.code === args.code);
      return data;
    },

    languages: () => languages,
    language: (_, args) => {
      const data = languages.find((language) => language.code === args.code);
      return data;
    },

    continents: () => continents,
    continent: (_, args) => {
      const data = continents.find((continent) => continent.code === args.code);
      return data;
    },

    
  },

  Country: {
    continent: (parent, args) =>
      continents.find(
        (continent) => continent.code === parent.continent_code
      ),
    languages: (parent, args) =>
      languages.filter((language) => language.code == parent.language_code),
  },

  Continent: {
    countries: (parent, args) => countries.filter((country) => country.code == parent.countries_code)
  }

};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
