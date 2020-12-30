const user_service = require('../services/User');
const auth_service = require('../services/Authentication');
const User = require('../models/User');
const BadInputError = require("../custom_errors/BadInputError");

exports.create = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.addUser(db, inputFilter(req.body));
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}


exports.list = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.listUsers(db);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.find = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            if (parseInt(req.params.username) === -1){
                return user_service.getUser(db, req.session.user);
            }
            return user_service.getUser(db, req.params.username);
        })
        .then(result => res.send(result))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.update = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.updateUser(db, inputFilter(req.body));
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}

exports.remove = function (req, res) {
    auth_service.authenticated(req.session)
        .then(() => {
            let db = req.app.get('db');
            return user_service.deleteUser(db, req.params.username);
        })
        .then(() => res.send('success'))
        .catch((error) => res.status(error.statusCode).send(error.message));
}


function inputFilter(user) {
    try{
        return new User(user.displayname, user.username, user.password);
    }catch(e){
        throw new BadInputError('The given record does not match the model of an record!');
    }
}