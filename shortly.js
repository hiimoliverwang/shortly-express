var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var sha1 = require('sha1');
//////////
var session = require('express-session');
var cookieParser = require('cookie-parser');
 
/////////

var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

///
app.use(bodyParser());
app.use(cookieParser('shhhh, very secret'));
app.use(session());
///

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.get('/', util.checkuser,
function(req, res) {
  res.render('index');
});

app.get('/signup', 
function(req, res) {
  res.render('signup');
});

app.post('/signup', function (req, res){
    console.log(req.body.username)
    console.log(req.body.password)
    Users.create({
      username:req.body.username,
      password:req.body.password
    })
    res.redirect('/login');
    // new User().fetchAll().then(function(user){
    //   console.log(user);
    // })
});

app.get('/links', 
function(req, res) {
  //check login
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  });
});

app.post('/links', 
function(req, res) {
  var uri = req.body.url;
  console.log('uri', uri);
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      //no need to login 
      //console.log('54.found.attr', found.attributes);
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        //console.log('58.title', title);
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        //if logged in , then this is okay, else you gun needa log in 
        //redirect to login 
        Links.create({
          url: uri,
          title: title,
          base_url: req.headers.origin
        })
        .then(function(newLink) {
          //console.log('70.newLink', newLink);
          res.send(200, newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

//write our own /login
app.post('/login', function (req, res){
  util.login(req, res, req.body.username, sha1(req.body.password));
});

app.get('/login', function (req, res){
  res.render('login');
})

app.get('/amazeballs', function (req, res){
  util.checkuser(res);
});

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

// app.get('/debug?port=5858', function (req, res){
//   res.send(200);
// })

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits')+1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
