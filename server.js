// Import various things...
var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var path=require('path');
var mongoose = require('mongoose');
var Task = require('./models/task');


// Instantiate express app
var app = express();

// Instantiate a mongoose connect call
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project')

// Set the express view engine to take care of ejs within html files
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// Let express know some URLs are only meant to load static assets
app.use('/static', express.static(path.join(__dirname, 'static')))

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }))

// Set up cookie session
app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// set up routes
app.use(bodyParser.urlencoded({ extended: false }))

// Get route for login / signup page, which shows by default
app.get('/', function (req, res, next) {
  res.render('index');
});

// Post route for login - to check if the credials match the DB and login if so
app.get('/home', function (req, res, next) {
  res.render('home', {user: req.session.user});
});


// Access account routes
var accountRoutes = require('./routes/account.js');
app.use('/account', accountRoutes);

// Access api routes
var apiRoutes = require('./routes/api.js');
app.use('/api', apiRoutes);


app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
