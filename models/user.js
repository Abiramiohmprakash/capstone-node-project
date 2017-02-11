var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isHBO: {
        type: String
    }
});

var user = module.exports = mongoose.model('user', userSchema);



module.exports.createUser = function (newUser, callback) {
    bcrypt.hash(newUser.password, 10, function (err, hash) {
        if (err) throw err;
        // set hashed pwd
        newUser.password = hash;
        // create user
        newUser.save(callback);
    });
}

module.exports.getUserByUsername = function (username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
}

module.exports.validatePassword = function (password, callback) {
    bcrypt.compareSync(password, this.password, function (err, isValid) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}
