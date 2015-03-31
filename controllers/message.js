var db = require('../models');

exports.create = function (data, callback) {
    var message = new db.Message();
    message.content = data.content;
    message.creator = data.creator;
    message.save(callback);
};

exports.read = function (callback) {
    db.Message.find({})
        .sort('createAt')
        .exec(callback);
};

