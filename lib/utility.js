var request = require('request');

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

// exports.writeCookie = function (name,value,days) {
//     var date, expires;
//     if (days) {
//         date = new Date();
//         date.setTime(date.getTime()+(days*24*60*60*1000));
//         expires = "; expires=" + date.toGMTString();
//             }else{
//         expires = "";
//     }
//     document.cookie = name + "=" + value + expires + "; path=/";
// };

// exports.readCookie = function (name) {
//   var i, c, ca, nameEQ = name + "=";
//   ca = document.cookie.split(';');
//   for(i=0;i < ca.length;i++) {
//     c = ca[i];
//     while (c.charAt(0)==' ') {
//       c = c.substring(1,c.length);
//     }
//     if (c.indexOf(nameEQ) == 0) {
//       return c.substring(nameEQ.length,c.length);
//     }
//   }
//   return '';
// }

// exports.makeid = function()
// {
//     var text = "";
//     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//     for( var i=0; i < 5; i++ )
//         text += possible.charAt(Math.floor(Math.random() * possible.length));

//     return text;
// }
// var readCookie = exports.readCookie;
// var writeCookie = exports.writeCookie;
// var yourecool = {};


request({
    method: 'POST',
    uri: 'http://127.0.0.1:5984/_session',
    form: {
        name: 'test',
        password: 'test123'
    }

},
function(err, res, body) {
    if (err) { return console.log(err) };

    console.log(res.statusCode);
    console.log(res.headers);
    console.log(body);

    var myCookie = request.cookie(res.headers['set-cookie'][0]);

    var cookieJar = request.jar();
    cookieJar.setCookie(myCookie, 'http://127.0.0.1:5984/_session');

    request({
        method: 'GET',
        uri: 'http://127.0.0.1:5984/db',
        jar: cookieJar
    },
    function(err, res, body) {
        if (err) { return console.log(err) };

        console.log(cookieJar);
        console.log(res.statusCode);
        console.log(res.headers);
        console.log(body);
    });
});





exports.checkuser = function (res){
   var cook = exports.readCookie('shortly');
   if (!(cook in yourecool)){
    res.redirect('/login')
   } else {
    res.redirect ('/')
   }
}

exports.login = function (){
  var id = makeid();
  writeCookie('shortly', id, 30)
  yourecool[id]= true;

}

exports.logout = function (){
  delete yourecool[readCookie('shortly')]
}

