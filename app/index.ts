import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import mongoose from 'mongoose'
import { Socket } from 'socket.io';

const port = process.env.PORT || '3000';
const dbPath = process.env.MONGODB_URI || 'mongodb://localhost/thewall'

const app: express.Application = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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

const routes = require('./routes.js');
// import * as routes from './routes.js';
app.use('/api', routes);

io.on('connection', (socket: Socket) => {
    console.log(`user connected`);

    socket.on('new message', (message: {_id: string, content: string}) => {
        console.log(`user posted message: '${message.content}'`);

        io.emit('receive message', message);
    });

    socket.on('disconnect', () => {
        console.log(`user disconnected`);
    });
});

http.listen(port, () => {
    console.log(`Application started on port ${port}.`)
});