var express    = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app        = express(); 
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var session = require('express-session');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var moment = require('moment');
moment.locale('fr');

var TWITTER_CONSUMER_KEY = "lcEOKX6CKoE1Csh3gMJKPfsaQ";
var TWITTER_CONSUMER_SECRET = "bWWM5nifxZjEpnpNfn7K8QIZNYwO7fRlHzSPGqQJfOXW4icNyd";

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
mongoose.connect('mongodb://todown:todown@ds029901.mongolab.com:29901/todown', function(err) {
	if (err){
		console.log("ERROR while connecting the database");
		throw err;
	}
});

// Models
require('./models/User');
require('./models/Film');

var Users = mongoose.model('Users');
var FilmsUsers = mongoose.model('FilmsUsers');

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
	Users.update({"id_user":req.user.id, "displayName":req.user.displayName, "photo": req.user.photos[0].value},{"id_user":req.user.id},{upsert: true}, function(err,num) {
		if (err)
			res.send(err);
		console.log("post user");
		/*res.json('User created !');*/
		res.redirect("/#/loggedin");
	});
	
	//we redirect on /login set a vaiable an the client side and redirect again on the previous page

	/*if (req.session.returnto == '/')*/
	/*res.redirect("/#/profile");*/
	/*else*/
	/*res.redirect("/#"+req.session.returnto);*/
  });

// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
	/*console.log("loggedin : returnto : " + req.session.returnto);*/
	/*console.log("id_user : " + req.user);*/
	res.send(req.isAuthenticated() ? { "user":req.user, "returnto": req.session.returnto}: { "user":'0', "returnto": req.session.returnto});
});


app.get('/logout', auth, function(req, res){
	req.logout();
	res.redirect("/#/loggedin");
	/*if (req.session.returnto == '/#/profile')*/
	/*res.redirect("/#/");*/
	/*else*/
	/*res.redirect("/#"+req.session.returnto);*/
});

// RESTFUL API
router.route('/films')
	.get(auth, function(req, res) {
		FilmsUsers.find({ 'id_user': req.user }, function (err, docs) {
			// docs is an array
			/*console.log(docs);*/
			if (err)
				res.send(err);
			res.json(docs);
		});
	})
	.post(auth, function(req, res) {
		// we can implement 3 ways to warn the user by adding a "warn_date" in the card.
		
		// this is the fourth way to warn the user (3 month after the add)
		console.log(moment().add(3, 'M').format('L'));
		//this is the second way 
		console.log(req.body.release_date + "+ 3 months");

		FilmsUsers.update({"id_freebase": req.body.idFilm, "id_user": req.user, "warn_date": moment().format('L')} ,{"id_freebase":req.body.idFilm}, {upsert: true}, function(err, num) {
			if (err)
				res.send(err);
			console.log("post film");
			res.json('OK');
		});
	})
	//here we use put because the delete methode can't take body params and our id are strings with slashes
	.put(auth, function(req, res) {
		FilmsUsers.remove({"id_freebase":req.body.idFilm, "id_user":req.user}, function(err, num) {
			if (err)
				res.send(err);
			console.log("delete film");
			res.json('OK');
		});
	});

router.route('/users')
	.get(function(req, res) {
		Users.find({ 'id_user': req.user}, function (err, docs) {
			// docs is an array
			if (err)
				res.send(err);
			/*console.log("user infos : ");*/
			/*console.log(docs);*/
			res.json(docs[0]);
		});
	})
	.put(function(req, res) {
		/*console.log(req.user);*/
		/*console.log(req.body.email);*/
		Users.update({'id_user':req.user},{'id_user':req.user, "email":req.body.email}, function(err,num) {
			console.log("put user");
			console.log(num);
			if (num > 0)
				res.json('OK');
			else
				res.json('KO');
		});
	})


router.route('/cron')
	.get(function(req, res) {
		FilmsUsers.find({'warn_date': moment().format('L')}, function (err, docs) {
			if (err)
				res.send(err);
			docs.forEach(function(item) { 
				console.log(item);
				Users.find({'id_user': item.id_user}, function (err, docs) {
					if (err)
						res.send(err);
					var email = "";
					Users.find({'id_user': item.id_user}, function (err, docs) {
						if (err)
							res.send(err);
						email = docs[0].email; 
						transporter.sendMail({
							from: 'blablanumerodeux@gmail.com',
							to: email,// go here to receive the mails : http://www.adresseemailtemporaire.com/inbox/teleworm.us/cnam/
							subject: 'hello',
							text: 'hello world!'
						},function(error, info){
							if(error){
								console.log(error);
							}else{
								console.log('Message sent: ' + info.response);
							}
						
						});
						console.log(docs[0]);
					});
				});
			})
			res.json(docs);
		});
	})

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

