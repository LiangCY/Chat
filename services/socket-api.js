var async = require('async');

var Controllers = require('../controllers');

exports.connect = function (socket) {
    var _userId = socket.request.session._userId;
    Controllers.User.online(_userId, function (err, user) {
        if (err) {
            socket.emit('err', {msg: err});
        } else {
            socket.broadcast.emit('chat', {
                action: 'online',
                data: user
            });
        }
    });
};

exports.disconnect = function (socket) {
    var _userId = socket.request.session._userId;
    Controllers.User.offline(_userId, function (err, user) {
        if (err) {
            socket.emit('err', {msg: err});
        } else {
            socket.broadcast.emit('chat', {
                action: 'offline',
                data: user
            });
        }
    })
};

exports.authorize = function (socket, cookie, cookieParser, sessionStore, next) {
    var handshakeData = socket.request;
    handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
    var connectSid = handshakeData.cookie['connect.sid'];
    connectSid = cookieParser.signedCookie(connectSid, 'chat');
    if (connectSid) {
        sessionStore.get(connectSid, function (error, session) {
            if (error) {
                next(error.message, false);
            } else {
                handshakeData.session = session;
                if (session._userId) {
                    next(null, true);
                } else {
                    next('No login');
                }
            }
        });
    } else {
        next('No session');
    }
};

exports.getRoom = function (data, socket, io) {
    async.parallel([
        function (done) {
            Controllers.User.getOnlineUsers(done);
        },
        function (done) {
            Controllers.Message.read(done);
        }
    ], function (err, results) {
        if (err) {
            socket.emit('err', {msg: err});
        } else {
            socket.emit('chat', {
                action: 'roomData',
                data: {
                    users: results[0],
                    messages: results[1]
                }
            });
        }
    });

};

exports.createMessage = function (message, socket, io) {
    Controllers.Message.create(message, function (err, message) {
        if (err) {
            socket.emit('err', {msg: err});
        } else {
            io.sockets.emit('chat', {
                action: 'messageAdded',
                data: message
            });
        }
    });
};