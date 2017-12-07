const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../model/todo');
const {User} = require('./../../model/user');

// #################### TODOS ####################

const todo = [
    {
        _id: new ObjectID(),
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completed_at: 123
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

const clear_todo_collection = (done) => {
    Todo.remove({})
            .then(() => done());
};

// #################### USER ####################

const user_one_id = new ObjectID();
const user_two_id = new ObjectID();

const user = [{
    _id: user_one_id,
    email: 'johannes@example.com',
    password: 'Password1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user_one_id, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: user_two_id,
    email: 'jenny@example.com',
    password: 'Password1',
    // tokens: [{
    //     access: 'auth',
    //     token: jwt.sign({_id: user_two_id, access: 'auth'}, 'abc123').toString()
    // }]
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

const clear_user_collection = (done) => {
    User.remove({})
            .then(() => done());
};

// #################### EXPORTS ####################

module.exports = {
    todo,
    seed_todo,
    clear_todo_collection,
    user,
    seed_user,
    clear_user_collection
};
