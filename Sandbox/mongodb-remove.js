const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {User} = require('./../server/model/user');

// Remove all documents
// Todo.remove({})
//         .then((result) => {
//             console.log(result);
//         });

// Remove the first found document
// Todo.findOneAndRemove
// Todo.findByIdAndRemove

let id = '5a24017430f4871688c653b7';

Todo.findByIdAndRemove(id)
        .then((doc) => {
            console.log(doc);
        });