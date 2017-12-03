const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {User} = require('./../server/model/user');

let id = '5a23dfc40469c0c82155271f';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}

let query = {
    _id: id
};

Todo.find(query)
        .then((docs) => {
            if (docs.length === 0) {
                return console.log('No records found');
            }
            console.log('Todos: ', docs);
        });

Todo.findOne(query)
        .then((doc) => {
            if (!doc) {
                return console.log('No records found');
            }
            console.log('Todo: ', doc);
        });

Todo.findById(id)
        .then((doc) => {
            if (!doc) {
                return console.log('Id not found');
            }
            console.log('Todo by id: ', doc);
        })
        .catch((err) => console.log(err));

let user_id = '5a22dbf89714eab9893850f3';

User.findById(user_id)
        .then((doc) => {
            if (!doc) {
                return console.log('No record found');
            }
            console.log('User by id: ', doc);
        })
        .catch((err) => console.log(err));