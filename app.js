
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , GitHubApi = require('github')
  , passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy;

/* oauth setting */
var clientId = < Client ID >;
var secret = < Client Secret >;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: clientId,
    clientSecret: secret,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {   
       return done(null, accessToken);
    });
  }
));

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport! Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
//  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/* node-github */
var github = new GitHubApi({
  version: "3.0.0"
});

// Filter
var login_check = function(req, res, next){
    if(!req.session.passport.user){
        res.redirect('/auth/github');
        return;
    }
    next();
}

var config = {github: github};
routes = routes(config);
app.get('/', login_check, routes.index);
app.get('/auth/github', passport.authenticate('github'), routes.auth);
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/auth/github' }), routes.callback);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
