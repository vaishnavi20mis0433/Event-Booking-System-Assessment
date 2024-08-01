import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';

import mongoose from 'mongoose';

const graphQlSchema =   require('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

// CORS setup
app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(isAuth);

// only one endpoint exposed to consumers
app.use('/api', graphqlHttp({
    schema: graphQlSchema,
    // a bundle for all your resolvers - must have exact same names defined above
    rootValue: graphQlResolver,
    // gets a special url to test the graphql api
    graphiql: true
  }),
);

mongoose
  .connect(
    `mongodb+srv://${ process.env.MONGO_USER }:${ process.env.MONGO_PASSWORD }@cluster0-v3kms.gcp.mongodb.net/${ process.env.MONGO_DATABASE }?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }) // not necessary, just adding this in to ignore a warning
  .then(() => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err)
  });

