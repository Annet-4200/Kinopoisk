const UserClass = require('../Realm/Models/UserClass');
const moment = require('moment');
const createError = require('http-errors');

module.exports = function (req, res, next) {
  if (!req.body.token) {
    return next(createError(401, 'Log in, please'))
  } else {
    if (Array.from(UserClass.getUsers().filtered( `token = "${req.body.token}"`)).length > 0) {
      if (moment().format('x') > moment(+UserClass.getUsers().filtered(`token = "${req.body.token}"`)[0].expiration).format('x')) {
        return next(createError(403, 'Token expired'))
      } else {
        next()
      }
    } else {
      next(createError(403, 'Wrong token'))
    }
  }
};