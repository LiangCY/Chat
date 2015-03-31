/**
 * Created by lcy on 2015/3/17.
 */
var express = require('express');

var cookie = require('cookie');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

var app = express();

var server = require('http').createServer(app);
var port = process.env.PORT || 8000;
var env = process.env.NODE_ENV || 'development';

var io = require('socket.io')(server);

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var sessionStore = new MongoStore({
    url: 'mongodb://localhost/chat'
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'chat',
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    store: sessionStore,
    resave: true,
    saveUninitialized: false
}));


if ('development' == env) {
    app.set('staticPath', '/public');
}

if ('production' == env) {
    app.set('staticPath', '/build');
}

app.use(express.static(__dirname + app.get('staticPath')));

var api = require('./services/api');
var socketApi = require('./services/socket-api');

app.post('/api/login', api.login);
app.get('/api/logout', api.logout);
app.get('/api/validate', api.validate);

io.use(function (socket, next) {
    socketApi.authorize(socket, cookie, cookieParser, sessionStore, next);
});

io.on('connection', function (socket) {

    socketApi.connect(socket);

    socket.on('disconnect', function () {
        socketApi.disconnect(socket);
    });

    socket.on('chat', function (request) {
        socketApi[request.action](request.data, socket, io);
    });
});


