const {User} = require('./../model/user');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');

    User.findByToken(token)
            .then((user) => {
                if (!user) {
                    return Promise.reject('Could not authenticate');
                }
                req.data.user = user;
                req.data.token = token;
                next();
            })
            .catch((err) => {
                req.result.http_code = 401;
                req.result.message = 'Unauthorized';
                req.result.errors.push(err);
                res.status(req.result.http_code).send(req.result);
            });
};

module.exports ={
    authenticate
};