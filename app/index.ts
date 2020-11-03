import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';

const { port, dbPath } = require('./../site.config.js');
// import { port, dbPath } from './../site.config.js';

const app: express.Application = express();

const routes = require('./routes.js');
// import * as routes from './routes.js';

mongoose.connect(dbPath);
const db = mongoose.connection;
db.on('error', console.error.bind(console, `connection error:`));
db.once('open', () => {
    console.log(`MongoDB connected successfully at "${dbPath}".`);
});

// app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, './../public')));

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Application started on port ${port}.`)
});