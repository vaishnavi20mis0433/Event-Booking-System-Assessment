import { buildSchema } from 'graphql';

module.exports = buildSchema(`

  type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    createdBy: User!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    events: [Event!]
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    getEvents: [Event!]!
    getBookings: [Booking!]!
    login(email: String!, password: String!): AuthData! 
  }

  type RootMutation {
    createEvent(input: EventInput): Event
    createUser(input: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
  }

  schema {
    query: RootQuery 
    mutation: RootMutation
  }
`);