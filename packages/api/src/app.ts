import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { createYoga } from 'graphql-yoga';
import path from 'path';
import { schema } from 'src/graphql';
import { serve, setup } from 'swagger-ui-express';
import yaml from 'yamljs';
import { PORT } from './constants';
import { AuthController } from './controllers';
import { SmesController } from './controllers/SmesController';
import { UsersController } from './controllers/UsersController';
import { TransactionsController } from './controllers/TransactionsController';
import { errorHandler, tokenParserMiddleware } from './middleware';

const allowedOrigin =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:4173'
    : 'http://localhost:3300';

const app = express();

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname, 'static')));

// Setup the swagger docs
const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
app.use('/docs', serve, setup(swaggerDocument));

// Auth
app.get('/api/auth-check', AuthController.checkAuth);
app.post('/api/login', AuthController.login);
app.post('/api/logout', AuthController.logout);

app.get('/api/sme-data', tokenParserMiddleware, SmesController.getSme);
app.get('/api/users', tokenParserMiddleware, UsersController.getUsers);
app.get(
  '/api/transactions',
  tokenParserMiddleware,
  TransactionsController.getTransactions
);

// GraphQL
const yoga = createYoga({ schema });
app.use(yoga.graphqlEndpoint, yoga);

app.use(errorHandler);

console.log('\n 🚀\x1b[33m finmid\x1b[90m mock API online\x1b[93m :) \x1b[0m');
console.log(
  `\n\t\x1b[33m ➜\x1b[37m Running on\x1b[33m \t\thttp://localhost:${PORT}\x1b[0m`
);
console.log(
  `\t\x1b[33m ➜\x1b[90m Documentation at\x1b[33m \thttp://localhost:${PORT}/docs\x1b[0m\n`
);
app.listen(PORT);
