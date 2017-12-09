const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    console.log('############## ENV: ' + env + ' ##############');

    let env_config = config[env];

    Object.keys(env_config).forEach((key) => {
        process.env[key] = env_config[key];
    });
}

// console.log('############## ENV: ' + env + ' ##############');
// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/todo_app';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/todo_app_test';
// }