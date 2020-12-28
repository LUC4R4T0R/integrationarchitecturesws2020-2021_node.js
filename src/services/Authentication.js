let NotAuthenticatedError = require('../custom_errors/NotAuthenticatedError');

exports.authenticated = async function (session) {
    if (session !== undefined && session.loggedIn) {
        console.log(session);
        return;
    }
    throw new NotAuthenticatedError();
}

exports.authenticate = function (session , username) {
    session.user = username;
    session.loggedIn = true;
}

exports.deAuthenticate = function (session) {
    session.loggedIn = false;
    session.destroy();
}