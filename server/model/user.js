const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return new Promise((resolve, reject) => {
                    resolve(validator.isEmail(value))
                });
            },
            message: '{value} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    // using a normal function to bind 'this'
    let user = this;
    let user_object = user.toObject();

    return {_id: user_object._id, email: user_object.email};
};

UserSchema.methods.generate_auth_token = function () {
    // using a normal function to bind 'this'
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toString(), access}, 'abc123').toString();

    user.tokens.push({
        access,
        token
    });

    return user.save()
            .then(() => token);
};

UserSchema.statics.find_by_token = function (token) {
    // using a normal function to bind 'this'
    let User = this;
    let decoded;


    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (err) {
        return Promise.reject('Could not authenticate');
    }

    let query = {
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    };

    return User.findOne(query);
};

UserSchema.statics.find_by_credentials = function (email, password) {
    // using a normal function to bind 'this'
    let User = this;
    let query = {
        email
    };

    return new Promise((resolve, reject) => {
        User.findOne(query)
                .then((user) => {
                    if (!user) {
                            reject('Invalid credentials')
                    }

                        bcrypt.compare(password, user.password, (err, result) => {
                            if (result) {
                                resolve(user);
                            } else {
                                reject('Invalid credentials');
                            }
                        });
                });
    });
};

UserSchema.pre('save', function (next) {
    // using a normal function to bind 'this'
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});


let User = mongoose.model('User', UserSchema);

module.exports = {
    User
};