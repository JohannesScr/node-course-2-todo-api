const Express = require('express');
const body_parser = require('body-parser');

let server_settings_service = require('./server.settings');
let {mongoose} = require('./db/mongoose');
let {Todo} = require('./model/todo');
let {User} = require('./model/user');

const app = Express();

const PORT = 3000;

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

// #### USER


app.listen(PORT, () => {
    console.log(`Express App successful listening on port: ${PORT}`);
});

module.exports = {
    app
};