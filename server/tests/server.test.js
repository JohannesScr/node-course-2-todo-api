const assert = require('assert');
const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');

const todo = [
    {
        _id: new ObjectID(),
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
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

describe('GET /todo/:id', () => {
    it('should return one todo doc', (done) => {
        request(app)
                .get(`/todo/${todo[0]._id.toString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.todo.text).toBe(todo[0].text);
                })
                .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        let id = new ObjectID().toString();
        request(app)
                .get(`/todo/${id}`)
                .expect(404)
                .end(done);
    });

    it('should return a 404 for non-object ids', (done) => {
        request(app)
                .get(`/todo/${todo[0]._id.toString() + 'extra'}`)
                .expect(404)
                .end(done);
    });
});

describe('DELETE /todo/:id', () => {
    it('should remove a todo', (done) => {
        let id = todo[1]._id.toString();

        request(app)
                .delete(`/todo/${id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.todo._id).toBe(id);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.findById(id)
                            .then((doc) => {
                                assert.equal(doc, null);
                                done();
                            })
                            .catch((err) => done(err));
                });
    });

    it('should return 404 if todo not found', (done) => {
        let id = new ObjectID().toString();

        request(app)
                .delete(`/todo/${id}`)
                .expect(404)
                .end(done);
    });

    it('should return 404 if object id is not valid', (done) => {
        let id = new ObjectID().toString() + 'extra';

        request(app)
                .delete(`/todo/${id}`)
                .expect(404)
                .end(done);
    });
});