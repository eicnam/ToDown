var express    = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app        = express(); 
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var session = require('express-session');
var mongoose = require('mongoose');

var TWITTER_CONSUMER_KEY = "7gvGiNP4gTDNql7IXwf2FIGTv";
var TWITTER_CONSUMER_SECRET = "2TQAD5HRtokFiO9wvKB6bF2noHqZOmiz1RShWRUjGmcYUUDJp0";

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({
	        extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	        secret: '<mysecret>',
	        saveUninitialized: true,
	        resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Database connection
mongoose.connect('mongodb://todown:todown@ds029901.mongolab.com:29901/todown');

// Models
require('./models/User');
require('./models/Film');

var User = mongoose.model('User');
var Film = mongoose.model('Film');

passport.use( new TwitterStrategy({
	consumerKey: TWITTER_CONSUMER_KEY,
	consumerSecret: TWITTER_CONSUMER_SECRET,
	callbackURL: "/auth/twitter/callback"
	},
	function(token,tokenSecret,profile,done){
		/*console.log(token);*/
		/*console.log(tokenSecret);*/
		/*console.log(profile);*/
		/*process.nextTick(function(){*/
		return done(null,profile);
	})
);

var router = express.Router(); 

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	//we search the user with his id
	done(null, id);
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
	if (!req.isAuthenticated())
		res.send(401);
		/*res.redirect("/#/profile");*/
	else
		next();
};


router.use(function(req, res, next) {
	//her we log everything
	/*app.use(express.logger('dev'));	*/
	console.log('Request recieved : ' + req.url);
	next();
});

router.route('/auth/twitter')
.get(function(req, res, next) {
	//before sending 
	//we save the page the user were before login
	req.session.returnto=req.query.returnto;
	next();
}, passport.authenticate('twitter'));

router.route('/auth/twitter/callback')
  .get(passport.authenticate('twitter', { 
	  /*successRedirect: '/profile',*/
	  failureRedirect: '/'
  }),function(req,res){
	//after sending
	//req.user is set
	  /*console.log(req.user);*/
	  /*console.log(req.session);*/
	if (req.session.returnto == '/')
		res.redirect("/#/profile");
	else
		res.redirect("/#"+req.session.returnto);
  });

// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0');
});


app.get('/logout', auth, function(req, res){
	req.logout();
	if (req.session.returnto == '/#/profile')
		res.redirect("/#/");
	else
		res.redirect("/#"+req.session.returnto);
});

// RESTFUL API
router.route('/films')
	.get(function(req, res) {
		res.json( 
			[{
				name : "monFilm1"
			},{
				name : "monFilm2"
			},{
				name : "monFilm3"
			}]
		);
	})
	.post(function(req, res) {
		console.log("post films");
		console.log(req.body);
		res.json("OK");
	});

router.route('/users')
	.get(function(req, res) {
		res.json({
			name : "dreaser",
			imageUrl:"url"
		});
	});


router.route('/')
	.get(function(req, res) {
		//her we send the home page
		/*res.sendfile('public/index.html');*/
		res.render('public/index');
	});

app.use('/', router);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen( port, ipaddress, function() {
	console.log((new Date()) + ' Server is running on port ' + port);
});

