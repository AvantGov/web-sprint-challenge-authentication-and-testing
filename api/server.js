const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session)
const database_access = require("../database/dbConfig")
const environment = require("dotenv/config")

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.JWT_VERIFY,
    store: new KnexSessionStore({
        knex: database_access,
        createtable: true
    })
}))

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

module.exports = server;
