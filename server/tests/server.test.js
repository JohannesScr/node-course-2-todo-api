const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');

const todo = [
    {
        text: 'First test todo'
    },
    {
        text: 'Second test todo'
    }
];

beforeEach((done) => {
    // clear all records in the database
    Todo.remove({})
            .then(() => {
                return Todo.insertMany(todo);
            })
            .then(() => done());
});

describe('POST /todo', () => {
    it('should create a new todo', (done) => {
        let body = {
            text: 'Test todo text'
        };

        request(app)
                .post('/todo')
                .send(body)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.todo.text).toBe(body.text);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.find({text: body.text})
                            .then((todo) => {
                                expect(todo.length).toBe(1);
                                expect(todo[0].text).toBe(body.text);
                                done();
                            })
                            .catch((err) => done(err));
                });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
                .post('/todo')
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.find()
                            .then((todo) => {
                                expect(todo.length).toBe(2);
                                done();
                            })
                            .catch((err) => done(err));
                });
    });
});

describe('GET /todo', () => {
    it('should get all todos', (done) => {
        request(app)
                .get('/todo')
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.todo.length).toBe(2)
                })
                .end(done);
    });
});