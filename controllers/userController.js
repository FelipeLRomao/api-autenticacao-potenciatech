const uuid = require('uuid');

let users = [];

const createUser = async (name, email, password) => {
    const newUser = { id: uuid.v4(), name, email, password };
    users.push(newUser);
    return newUser;
};

const findUserByEmail = async (email) => {
    return users.find(user => user.email === email);
};

module.exports = { createUser, findUserByEmail };
