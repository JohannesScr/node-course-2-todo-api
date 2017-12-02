const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo_app', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connected to MongoDB server');

    // deleteMany
    // let query = {
    //      text: 'Eat lunch'
    // };

    // db.collection('cl_todo').deleteMany(query)
    //         .then((result) => {
    //             console.log(result);
    //         });

    // deleteOne
    // let query = {
    //     text: 'Eat lunch'
    // };
    //
    // db.collection('cl_todo').deleteOne(query)
    //         .then((result) => {
    //             console.log(result);
    //         });

    // findOneAndDelete
    // let query = {
    //     _id: new ObjectID('5a21ae5f2a0ea8b0f57e2c23')
    // };
    //
    // db.collection('cl_todo').findOneAndDelete(query)
    //         .then((result) => {
    //             console.log(result);
    //         });

    // db.close();
});