require('./config/config');

const Express = require('express');
const body_parser = require('body-parser');
const {ObjectID} = require('mongodb');

const server_settings_service = require('./server.settings');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./model/todo');
const {User} = require('./model/user');

const app = Express();
const PORT = process.env.PORT;

app.use(body_parser.json());
app.use(server_settings_service.log_url);
app.use(server_settings_service.add_result_object);

// #### TODO
app.post('/todo', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save()
            .then((doc) => {
                req.result.data.todo = doc;
                req.result.message = 'Saved Todo successfully';
                res.send(req.result);
            })
            .catch((err) => {
                console.log('Unable to save todo: ', err);
                req.result.http_code = 400;
                req.result.message = 'Bad Request: ' + err.message;
                req.result.errors.push(err.message);

                res.status(req.result.http_code).send(req.result);
            });
});
app.get('/todo', (req, res) => {
    Todo.find()
            .then((docs) => {
                req.result.data.todo = docs;
                req.result.message = 'Found Todo';
                res.send(req.result);
            })
            .catch((err) => {
                console.log('Unable to save todo: ', err);
                req.result.http_code = 400;
                req.result.message = 'Bad Request: ' + err.message;
                req.result.errors.push(err.message);

                res.status(req.result.http_code).send(req.result);
            });
});
app.get('/todo/:id', (req, res) => {
    let id;

    if (!req.params.id) {
        req.result.http_code = 400;
        req.result.message = 'Bad Request';
        req.result.errors.push('Request must have a params.id');
    } else if (!ObjectID.isValid(req.params.id)) {
        req.result.http_code = 404;
        req.result.message = 'Not Found';
        req.result.errors.push('Request must have a valid id');

    } else {
        id = req.params.id;
    }

    if (req.result.errors.length > 0) {
        res.status(req.result.http_code).send(req.result);
    }

    Todo.findById(id)
            .then((doc) => {
                if (!doc) {
                    req.result.http_code = 404;
                    req.result.message = 'Not Found';
                    return res.status(req.result.http_code).send(req.result);
                }
                req.result.message = 'Record found';
                req.result.data.todo = doc;
                res.send(req.result);
            })
            .catch((err) => {
                req.result.http_code = 400;
                req.result.message = 'Not Found' + err.message;
                req.result.errors.push('Request must have a valid id' + err.message);
            });
});
app.delete('/todo/:id', (req, res) => {
    let id;

    if (!req.params.id) {
        req.result.http_code = 400;
        req.result.message = 'Bad Request';
        req.result.errors.push('Request must have a params.id');
    } else if (!ObjectID.isValid(req.params.id)) {
        req.result.http_code = 404;
        req.result.message = 'Not Found';
        req.result.errors.push('Request must have a valid id');
    } else {
        id = req.params.id;
    }

    if (req.result.errors.length > 0) {
        res.status(req.result.http_code).send(req.result);
    }

    Todo.findByIdAndRemove(id)
            .then((doc) => {
                if (!doc) {
                    req.result.http_code = 404;
                    req.result.message = 'No record found to delete';
                    return res.status(req.result.http_code).send(req.result);
                }
                req.result.message = 'Record deleted successfully';
                req.result.data.todo = doc;
                res.status(req.result.http_code).send(req.result);
            })
            .catch((err) => {
                req.result.http_code = 400;
                req.result.message = 'Not Found' + err.message;
                req.result.errors.push('Request must have a valid id' + err.message);
            });
});
app.patch('/todo/:id', (req, res) => {
    let id;

    if (!req.params.id) {
        req.result.http_code = 400;
        req.result.message = 'Bad Request';
        req.result.errors.push('Request must have a params.id');
    } else if (!ObjectID.isValid(req.params.id)) {
        req.result.http_code = 404;
        req.result.message = 'Not Found';
        req.result.errors.push('Request must have a valid id');
    } else {
        id = req.params.id;
    }

    if (req.result.errors.length > 0) {
        res.status(req.result.http_code).send(req.result);
    }

    // let body = _.pick(req.body, ['text', 'completed']);
    let body = {};
    if (req.body.text) {
        body.text = req.body.text
    }
    if (req.body.completed) {
        body.completed = req.body.completed
    }

    if (typeof body.completed === 'boolean' && body.completed === true) {
        body.completed_at = new Date().getTime();
    } else {
        body.completed = false;
        body.completed_at = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
            .then((doc) => {
                if (!doc) {
                    req.result.http_code = 404;
                    req.result.message = 'No record found to update';
                    return res.status(req.result.http_code).send(req.result);
                }
                req.result.message = 'Record updated successfully';
                req.result.data.todo = doc;
                res.status(req.result.http_code).send(req.result);
            })
            .catch((err) => {
                req.result.http_code = 400;
                req.result.message = 'Not Found' + err.message;
                req.result.errors.push('Request must have a valid id' + err.message);
            });
});

// #### USER
app.post('/user', (req, res) => {
    let user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save()
            .then(() => {
                return user.generate_auth_token();
            })
            .then((token) => {
                req.result.data.user = user;
                req.result.message = 'Saved user successfully';
                res.header('x-auth', token).send(req.result);
            })
            .catch((err) => {
                console.log('Unable to save user: ', err);
                req.result.http_code = 400;
                req.result.message = 'Bad Request: ' + err.message;
                req.result.errors.push(err.message);

                res.status(req.result.http_code).send(req.result);
            });
});

app.listen(PORT, () => {
    console.log(`Express App successful listening on port: ${PORT}`);
});

module.exports = {
    app
};