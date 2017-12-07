// const assert = require('assert');
const request = require('supertest');
// const expect = require('expect');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {User} = require('./../model/user');
const {todo, seed_todo, clear_todo_collection, user, seed_user, clear_user_collection} = require('./seed/seed');

beforeEach(seed_user);
// afterEach(clear_user_collection);
beforeEach(seed_todo);
// afterEach(clear_todo_collection);

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
                    expect(res.body.data.todo.text).to.equal(body.text);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.find({text: body.text})
                            .then((todo) => {
                                expect(todo.length).to.equal(1);
                                expect(todo[0].text).to.equal(body.text);
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
                                expect(todo.length).to.equal(2);
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
                    expect(res.body.data.todo.length).to.equal(2)
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
                    expect(res.body.data.todo.text).to.equal(todo[0].text);
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
                    expect(res.body.data.todo._id).to.equal(id);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.findById(id)
                            .then((doc) => {
                                expect(doc).to.equal(null);
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
    it('should update the todo', (done) => {
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
                    expect(res.body.data.todo.text).to.equal(body.text);
                    expect(res.body.data.todo.completed).to.equal(true);
                    expect(res.body.data.todo.completed_at).to.be.an('number');
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
                    expect(res.body.data.user._id).to.equal(user[0]._id.toString());
                    expect(res.body.data.user.email).to.equal(user[0].email);
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
                            })
                            .catch((err) => done(err));
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

    // it('should not create user if email in use', (done) => {
    //     let password = '123bmn!';
    //
    //     let body = {
    //         email: user[0].email,
    //         password
    //     };
    //
    //     request(app)
    //             .post('/user')
    //             .send(body)
    //             .expect(400)
    //             .end(done());
    // });
});

describe('POST /login', () => {
    it('should login user and return auth token', (done) => {
        let body = {
            email: user[1].email,
            password: user[1].password
        };

        request(app)
                .post('/login')
                .send(body)
                .expect(200)
                .expect((res) => {
                    assert.ok(res.headers['x-auth']);
                })
                .end((err, res) => {
                    if (err) return done(err);

                    User.findById(user[1]._id)
                            .then((user) => {
                                expect(user.tokens[0]).to.deep.include({
                                    access: 'auth',
                                    token: res.headers['x-auth']
                                });
                                done();
                            })
                            .catch((err) => done(err));

                });
    });

    it('should reject invalid login', (done) => {
        let body = {
            email: user[1].email,
            password: 'ILovePie'
        };

        request(app)
                .post('/login')
                .send(body)
                .expect(400)
                .expect((res) => {
                    assert.notExists(res.headers['x-auth']);
                })
                .end((err, res) => {
                    if (err) return done(err);

                    User.findById(user[1]._id)
                            .then((user) => {
                                assert.notExists(user.tokens[0]);
                                done();
                            })
                            .catch((err) => done(err));

                });
    });
});

describe('DELETE /logout', () => {
    it('should remove auth token on logout', (done) => {
        let token = user[0].tokens[0].token;

        request(app)
                .delete('/logout')
                .set('x-auth', token)
                .expect(200)
                .expect((res) => {
                    assert.notExists(res.headers['x-auth']);
                })
                .end((err, res) => {
                    if (err) return done(err);

                    User.findById(user[1]._id)
                            .then((user) => {
                                assert.notExists(user.tokens[0]);
                                done();
                            })
                            .catch((err) => done(err));
                });
    });
});
