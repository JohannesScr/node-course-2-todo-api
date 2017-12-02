// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// let obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/todo_app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // let document_todo = {
    //     text: 'Something to do',
    //     completed: false
    // };

    // db.collection('cl_todo').insertOne(document, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert document', err);
    //     }
    //
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // let document_user = {
    //     name: 'Johannes',
    //     age: 24,
    //     location: 'Western Cape, South Africa'
    // };
    //
    // console.log('I/O?  >> 1');
    //
    // db.collection('cl_user').insertOne(document_user, (err, result) => {
    //     if (err) {
    //         return console.log('Error => Unable to insert document', err);
    //     }
    //     console.log('I/O?  >> 2');
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });
    //
    // console.log('I/O?  >> 3');

    db.close();
});
