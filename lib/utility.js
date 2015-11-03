var request = require('request');
var crypto = require('crypto');
var User = require('../app/models/user');



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


exports.encrypt = function(str){
  var shasum = crypto.createHash('sha1');
  shasum.update(str);
  console.log(shasum.digest('hex'));
  return shasum.digest('hex');
}




exports.checkuser = function (res){
   var cook = exports.readCookie('shortly');
   if (!(cook in yourecool)){
    res.redirect('/login')
   } else {
    res.redirect ('/')
   }
}

exports.login = function (request, response, userName, password){
  new User({
    username: userName,
    password: password
  }).fetch().then(function(user) {
    if (user){
      console.log('user from exports.login');
    } else {
      console.log('error IM CONTROLLING YOUR SCREEN')
    }
    
  })


}

