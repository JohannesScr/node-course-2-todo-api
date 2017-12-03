const assert = require('assert');
const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {User} = require('./../model/user');
const {todo, seed_todo, user, seed_user} = require('./seed/seed');

beforeEach(seed_user);
beforeEach(seed_todo);

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

describe('PATCH /todo/:id', () => {
    it('should update update the todo', (done) => {
        let id = todo[0]._id.toString();

        let body = {
            text: 'Patch update text',
            completed: true
        };

        request(app)
                .patch(`/todo/${id}`)
                .send(body)
                .expect(200)
                .expect((res) => {
                    assert.equal(res.body.data.todo.text, body.text);
                    assert.equal(res.body.data.todo.completed, true);
                    assert.equal(typeof res.body.data.todo.completed_at, 'number');
                })
                .end(done);
    });

    it('should clear completed at when todo is not completed', (done) => {
        let id = todo[1]._id.toString();

        let body = {
            text: 'Patch update text again',
            completed: false
        };

        request(app)
                .patch(`/todo/${id}`)
                .send(body)
                .expect(200)
                .expect((res) => {
                    assert.equal(res.body.data.todo.text, body.text);
                    assert.equal(res.body.data.todo.completed, false);
                    assert.equal(res.body.data.todo.completed_at, null);
                })
                .end(done);
    });
});

describe('GET /user/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
                .get('/user/me')
                .set('x-auth', user[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    assert.equal(res.body.data.user._id, user[0]._id.toString());
                    assert.equal(res.body.data.user.email, user[0].email);
                })
                .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
                .get('/user/me')
                .expect(401)
                .expect((res) => {
                    assert.deepEqual(res.body.data, {});
                })
                .end(done);
    });
});

describe('POST /user', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = '123bmn!';

        let body = {
            email,
            password
        };

        request(app)
                .post('/user')
                .send(body)
                .expect(200)
                .expect((res) => {
                    assert.ok(res.headers['x-auth'], true);
                    assert.ok(res.body.data.user._id, true);
                    assert.ok(res.body.data.user._id, true);
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }

                    let query = {email};

                    User.findOne(query)
                            .then((user) => {
                                assert.equal(user.email, email);
                                assert.notEqual(user.password, password);
                                done();
                            });
                });
    });

    it('should return validation errors if request invalid', (done) => {
        let email = 'jennyaexample.com';
        let password = 'abc';

        let body = {
            email,
            password
        };

        request(app)
                .post('/user')
                .send(body)
                .expect(400)
                .end(done());
    });

    it('should not create user if email in use', (done) => {
        let email = 'jenny@example.com';
        let password = '123bmn!';

        let body = {
            email,
            password
        };

        request(app)
                .post('/user')
                .send(body)
                .expect(400)
                .end(done());
    });
});
