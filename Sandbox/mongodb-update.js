const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo_app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connected to MongoDB server');

    // findOneAndUpdate
    // let query = {
    //     _id: new ObjectID('5a22cd2030f4871688c62e11')
    // };
    //
    // let update_object = {
    //     $set: {
    //         completed: true
    //     }
    // };
    //
    // db.collection('cl_todo').findOneAndUpdate(query, update_object, {returnOriginal: false})
    //         .then((document) => {
    //             console.log(document);
    //         });

    let query = {
        _id: new ObjectID('5a21b066d9ea1db15cf4abab')
    };

    let update_object = {
        $set: {
            name: 'Courtney'
        },
        $inc: {
            age: 1
        }
    };

    db.collection('cl_user').findOneAndUpdate(query, update_object, {returnOriginal: false})
            .then((document) => {
                console.log(document);
            });

    // db.close();
});