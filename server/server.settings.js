// ADD ALL SERVER SETTINGS HERE

exports.log_url = (req, res, next) => {
    console.log(req.url);
    next();
};

exports.add_result_object = (req, res, next) => {
    req.result = {
        http_code: 200,
        error_code: '',
        message: '',
        data: {},
        errors: []
    };
    req.data = {};
    next();
};