var request = require('request');
var crypto = require('crypto');
var User = require('../app/models/user');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')



exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

/************************************************************/
// Add additional utility functions below
/************************************************************/

// exports.encrypt = function(str){
//   var shasum = crypto.createHash('sha1');
//   shasum.update(str);
//   console.log('util.35', typeof shasum.digest('hex'));
//   var results = shasum.digest('hex');
//   return results;
// }

exports.checkuser = function (request, response, next){
   // var cook = exports.readCookie('shortly');
   // if (!(cook in yourecool)){
   //  res.redirect('/login')
   // } else {
   //  res.redirect ('/')
   // }
  if ( request.session.user ) {
    next();
  } else {
    response.redirect('/login')
  }
}

exports.login = function (request, response, userName, password){
  new User({
    username: userName,
    password: password
  }).fetch().then(function(user) {
    if (user){
      request.session.regenerate(function() {
        request.session.user = userName;
        response.redirect('/');
      })
    } else {
      response.redirect('/signup')
    }
  })
}

