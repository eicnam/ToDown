var express    = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app        = express(); 
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var session = require('express-session');
var mongoose = require('mongoose');
var Application = require('./models/application');

var TWITTER_CONSUMER_KEY = "7gvGiNP4gTDNql7IXwf2FIGTv";
var TWITTER_CONSUMER_SECRET = "2TQAD5HRtokFiO9wvKB6bF2noHqZOmiz1RShWRUjGmcYUUDJp0";

app.use(express.static(__dirname+"/public"));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session()); 
/*app.value('retrurnurl', { url: '/profile' });*/

passport.use( new TwitterStrategy({
	consumerKey: TWITTER_CONSUMER_KEY,
	consumerSecret: TWITTER_CONSUMER_SECRET,
	callbackURL: "/auth/twitter/callback"
	},
	function(token,tokenSecret,profile,done){
		/*process.nextTick(function(){*/
		/*console.log(profile);*/
		/*console.log(done);*/
		/*$scope.appname='toto';*/
		return done(null,profile);
	})
);

var port = process.env.PORT || 8080; 
var router = express.Router(); 

mongoose.connect('mongodb://toggle:toggle@ds049868.mongolab.com:49868/toggle');

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	done(null, id);
});

router.use(function(req, res, next) {
	//her we log everything
	/*app.use(express.logger('dev'));	*/
	console.log('Something is happening on the server.');
	/*console.log(req);*/
	next();
});

router.route('/auth/twitter')
.get(function(req, res, next) {
	// If this function gets called, authentication was successful.
	// `req.user` contains the authenticated user.
	console.log(req.query);
	req.session.returnto=req.query.returnto;
	console.log(req.session);
	/*console.log(next);*/
	next();
	/*res.redirect('/profile');*/
}, passport.authenticate('twitter'));

router.route('/auth/twitter/callback')
  .get(passport.authenticate('twitter', { 
	  /*successRedirect: '/profile',*/
	  failureRedirect: '/login'
  }),function(req,res){
	  /*console.log(req);*/
	console.log(req.query);
	var url = req.session.returnto;
	/*console.log(req.get('Referrer'));*/
	/*console.log(req.get('content-type'));*/
	console.log(req.session);
	res.redirect(url);
  });

router.route('/api/application')
	//this is a test : add a new application in the mongo database
      .get(function(req, res) {
      
	      application.name = "hey";

	      application.save(function(err) {
			if (err)
				res.send(err);
			res.json({ message: 'Application created!' });
	      });
      })
      .post(function(req, res) {
      
	      var application = new Application(); 
	      application.name = "hey";

	      application.save(function(err) {
			if (err)
				res.send(err);
			res.json({ message: 'Application created!' });
	      });
      });

router.route('/profile')
	.get(function(req, res){
		/*console.log(req);*/
		res.json({data : req.user});
	}
);


router.route('/')
	.get(function(req, res) {
		/*res.redirect('../index.html');*/
		//her we'll send the home page
		/*res.json({ message: 'hooray! welcome to our api!' });	*/
		/*$scope.appname = 'toto';*/
		res.set('appname', 'toto');
		res.sendfile('public/index.html');
	});
	      var application = new Application(); 

app.use('/', router);
app.listen(port);
console.log('Server is running on port ' + port);

