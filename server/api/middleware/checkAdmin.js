const UserClass = require('../Realm/Models/UserClass');
const moment = require('moment');
const createError = require('http-errors');

module.exports = function (req, res, next) {
  if (!req.body.token) {
    return next(createError(401, 'Log in, please'))
  } else {
    let user = Array.from(UserClass.getUsers().filtered(`token = "${req.body.token}"`));
      if (user.length > 0 && user[0].login === 'admin') {
        if (moment().format('x') > moment(+UserClass.getUsers().filtered(`token = "${req.body.token}"`)[0].expiration).format('x')) {
          return next(createError(403, 'Token expired'))
        } else {
          next()
        }
      } else {
        next(createError(403, 'Wrong token or you must have admin rights'))
      }
    }
};