"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var helmet_1 = __importDefault(require("helmet"));
var mongoose_1 = __importDefault(require("mongoose"));
var port = process.env.PORT || '3000';
var dbPath = process.env.MONGODB_URI || 'mongodb://localhost/thewall';
var app = express_1.default();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
mongoose_1.default.connect(dbPath);
var db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function () {
    console.log("MongoDB connected successfully at \"" + dbPath + "\".");
});
app.use(helmet_1.default.dnsPrefetchControl());
app.use(helmet_1.default.expectCt());
app.use(helmet_1.default.frameguard());
app.use(helmet_1.default.hidePoweredBy());
app.use(helmet_1.default.hsts());
app.use(helmet_1.default.ieNoOpen());
app.use(helmet_1.default.noSniff());
app.use(helmet_1.default.permittedCrossDomainPolicies());
app.use(helmet_1.default.referrerPolicy());
app.use(helmet_1.default.xssFilter());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, './../public')));
var routes = require('./routes.js');
app.use('/api', routes);
io.on('connection', function (socket) {
    console.log("user connected");
    socket.on('new message', function (message) {
        console.log("user posted message: '" + message.content + "'");
        io.emit('receive message', message);
    });
    socket.on('disconnect', function () {
        console.log("user disconnected");
    });
});
http.listen(port, function () {
    console.log("Application started on port " + port + ".");
});
