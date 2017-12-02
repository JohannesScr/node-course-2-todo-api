// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// let obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/todo_app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // let query = {
    //     _id: new ObjectID('5a22888730f4871688c62ac0')
    // };
    //
    // db.collection('cl_todo').find(query).toArray()
    //         .then((document) => {
    //             console.log('Todo:');
    //             console.log(JSON.stringify(document, undefined, 2));
    //         })
    //         .catch((err) => {
    //             console.log('Unable to get todo', err);
    //         });

    // db.collection('cl_todo').find().count()
    //         .then((count) => {
    //             console.log(`Todo count: ${count}`);
    //         })
    //         .catch((err) => {
    //             console.log('Unable to get todo', err);
    //         });

    let query = {
        name: 'Jen'
    };

    db.collection('cl_user').find(query).toArray()
            .then((document) => {
                console.log('Todo:');
                console.log(JSON.stringify(document, undefined, 2));
            })
            .catch((err) => {
                console.log('Unable to get todo', err);
            });

    // db.close();
});
