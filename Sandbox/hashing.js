const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abs!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log('Hash: ', hash);
//     });
// });

let hashed_password = '$2a$10$46EfCAsOe3bAfpLXTbP3Bu17X5npBcn1Amz.7Tl1ZbQvT4TvhIzJ6';

bcrypt.compare(password, hashed_password, (err, result) => {
    console.log('Result: ', result);
});

// let data = {
//     id: 10
// };
//
// let token = jwt.sign(data, '123abc');
// console.log(`Token: ${token}`);
//
// let decoded = jwt.verify(token, '123abc');
// console.log(`Decoded: ${JSON.stringify(decoded)}`);

// let message = 'I am user number 3';
//
// let hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//     id: 4
// };
//
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// let result_hash = SHA256(JSON.stringify(token.data) + 'secret').toString();
//
// if (result_hash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed, do not trust');
// }