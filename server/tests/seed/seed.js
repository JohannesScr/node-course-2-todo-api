const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../model/todo');
const {User} = require('./../../model/user');

// #################### USER ####################

const user_one_id = new ObjectID();
const user_two_id = new ObjectID();

const user = [{
    _id: user_one_id,
    email: 'johannes@example.com',
    password: 'Password1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user_one_id, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: user_two_id,
    email: 'jenny@example.com',
    password: 'Password1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user_two_id, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const seed_user = (done) => {
    User.remove({})
            .then(() => {
                // console.log('Begin seed user');
                return new Promise((resolve, reject) => {
                    let user_one = new User(user[0]).save();
                    let user_two = new User(user[1]).save();
                    // console.log('End seed user');
                    resolve([user_one, user_two]);
                });

            })
            .then(() => done());
};

// #################### TODOS ####################

const todo = [
    {
        _id: new ObjectID(),
        text: 'First test todo',
        _creator: user_one_id
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completed_at: 123,
        _creator: user_two_id
    }
];

const seed_todo = (done) => {
    // clear all records in the database
    Todo.remove({})
            .then(() => {
                // console.log('Begin seed todos');
                Todo.insertMany(todo);
                // console.log('End seed todos');
            })
            .then(() => done());
};

// #################### EXPORTS ####################

module.exports = {
    todo,
    seed_todo,
    user,
    seed_user,
};
