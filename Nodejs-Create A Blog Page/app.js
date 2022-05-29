var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

var checkLogin = require('./routes/checkLogin');
var models = require('./modules/models');

var db_user = models.db_user;
var db_note = models.db_note;


var app = express();
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// uncomment after placing favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// for bugs
app.use(logger('dev'));
// parse the incoming request 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/*
app.use(session({
	key: 'session',
	secret: 'keboard cat',
	cookie:{maxAge: 1000*60*60*24},
	store: new MongoStore({
		db: 'notes',
		mongooseConnection: mongoose.connection
	}),
	resave: false,
    saveUninitialized: true
}));
*/
app.get('/', function(req, res) {
    //res.render('index');
    res.send('respond with a resource');
  });

//Register
//app.get('/reg', checkLogin.login);
app.get('/reg',function(req,res){
		console.log("enter resigset");
		res.render('register', {
        title: 'Register',
        page: 'register',
        user: null
    });
   });

app.post('/reg',function(req,res){
        // In register.ejs 
        // <input type="password" class="form-control" name="passwordRepeat" placeholder="confirm password">
        var username = req.body.username;
        var password = req.body.password;
        var passwordRepeat = req.body.passwordRepeat;
        
        console.log("password"+password+"repeat"+passwordRepeat);
        if(password != passwordRepeat)
        {
            res.redirect('/res');
            console.log('enter password wrong');
        }		
        //Whether use exists
        db_user.find({username:username},function(err,data){

            if(err) {
                console.log(err);
                return res.redirect('/reg');
            }
            
            if(data.length > 0) {
                console.log(username);
                console.log(data);
                console.log('Username already is use')
                return res.redirect('/reg');
            } 
        
            //md5 password
            var md5 = crypto.createHash('md5'),
            md5password = md5.update(password).digest('hex');
        
            //create user
            var newUser = new db_user({
                username: username,
                password: md5password
            });
            newUser.save(function(err, doc) {
                if(err) {
                    console.log(err);
                    return res.redirect('/reg');
                }
                console.log('Register Success');
                console.log(newUser,username);
                //newUser.password = null;
                //delete newUser.password;
                //req.session.user = newUser;
                return res.redirect('/login');
            });
        });       
});
//Log out
app.get('/exit',function(req,res){
    console.log('exit executed')
    current=null;
    res.redirect('/login')
})
//Log In

//app.get('/login', checkLogin.login);
app.get('/login',function(req,res){
			console.log("login");			
		    res.render('login', {
       		title: 'Login',
       		page: 'login',
       		user: null
    });
   });
var current = null;  
 //post log in
app.post('/login',function(req,res){
		var username = req.body.username;
		var password = req.body.password;
		var md5 = crypto.createHash('md5'),
        md5password = md5.update(password).digest('hex');
		db_user.find({'username':username,'password':md5password},function(err,data){
			console.log(err);
			console.log(data);
			if(err)
			{
				console.log('login error');
				return next(err);
			}
			if(data.length>0 )
			{
				console.log(username);
		        //req.session.user = data;
                console.log(data);
                console.log(data != null);
                current = username;
                console.log('current',current);
		        //return res.redirect(`/index:${username}`);
                return res.redirect(`/index`)
			}
			else
			{   
                
				console.log('Log In Error');
				return res.redirect('/login');
			}
		});
		
   }); 
  
//app.get('/post', checkLogin.noLogin);
app.get('/post', function(req, res) {
    res.render('post', {
        title: 'post',
        user: current,
        page:'post'
    })
});
   
   //list
app.post('/post', function(req, res) {
    var note = new db_note({
        title: req.body.title,
        author: current,
        tag: req.body.tag,
        content: req.body.content
    });

    note.save(function(err, doc) {
        if(err) {
            console.log(err);
            return res.redirect('/post');
        }
        console.log('Publish Success！')
        return res.redirect('/index');
    });
});
   
// List
//app.get('/', checkLogin.noLogin);
app.get('/index', function(req, res) {
    db_note.find({author: current})
        .exec(function(err, arts) {
            if(err) {
                console.log(err);
                return res.redirect('/');
            }
            res.render('index', {
                title: 'Note List',
                user: current,
                page:'index',
                arts: arts
            });        
        })
});

// Detailed Notes
//app.get('/detail/:_id', checkLogin.noLogin);
app.get('/detail/:_id', function(req, res) {
    db_note.findOne({_id: req.params._id})
        .exec(function(err, art) {
            if(err) {
                console.log(err);
                return res.redirect('/');
            }
            if(art) {
                res.render('detail', {
                    title: 'NoteList',
                    user: current,
                    page:'detail',
                    art: art
                });
            }
        });
});

/*   
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/
  
app.listen(3000, function(req,res){
	console.log('app is running on the port 3000');
});

module.exports = app;
