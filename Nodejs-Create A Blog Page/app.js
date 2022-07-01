var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');
var checkLogin = require('./functions/checkLogin');
var { db_user, db_note } = require('./models/models');

// view engine setup
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
app.use(session({ secret: 'keyborad cat', resave: false }));

app.get('/', function (req, res) {
    if (req.session.username) {
        res.redirect('/index');
    } else {
        res.redirect('/login');
    }
});

//app.get('/reg', checkLogin.login);
app.get('/reg', function (req, res) {
    console.log('enter resigset');
    res.render('register', {
        title: 'Register',
        page: 'register',
        user: null,
    });
});
app.post('/reg', function (req, res) {
    // In register.ejs
    // <input type="password" class="form-control" name="passwordRepeat" placeholder="confirm password">
    var username = req.body.username;
    var password = req.body.password;
    var passwordRepeat = req.body.passwordRepeat;

    console.log('password' + password + 'repeat' + passwordRepeat);
    if (password != passwordRepeat) {
        res.redirect('/res');
        console.log('enter password wrong');
    }
    //Whether use exists
    db_user.find({ username: username }, function (err, data) {
        if (err) {
            console.log(err);
            return res.redirect('/reg');
        }

        if (data.length > 0) {
            console.log(username);
            console.log('Username already is use');
            return res.redirect('/reg');
        }

        //md5 password
        var md5 = crypto.createHash('md5'),
            md5password = md5.update(password).digest('hex');

        //create user
        var newUser = new db_user({
            username: username,
            password: md5password,
        });
        newUser.save(function (err, doc) {
            if (err) {
                console.log(err);
                return res.redirect('/reg');
            }
            if (doc) {
                console.log('Register Success');
            }
            //newUser.password = null;
            //delete newUser.password;
            return res.redirect('/login');
        });
    });
});

//Log out
app.get('/exit', function (req, res) {
    console.log('exit executed');
    req.session.username = null;
    res.redirect('/login');
});

//Log In
//app.get('/login', checkLogin.login);
app.get('/login', function (req, res) {
    console.log('login');
    res.render('login', {
        title: 'Login',
        page: 'login',
        user: null,
    });
});

//post log in
app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var md5 = crypto.createHash('md5'),
        md5password = md5.update(password).digest('hex');
    db_user.find({ username: username, password: md5password }, function (err, data) {
        if (err) {
            console.log('login error');
        }
        if (data.length > 0) {
            req.session.username = username;
            return res.redirect(`/index`);
        } else {
            console.log('Log In Error');
            return res.redirect('/login');
        }
    });
});

app.get('/post', checkLogin, function (req, res) {
    res.render('post', {
        title: 'post',
        user: req.session.username,
        page: 'post',
    });
});

app.post('/post', checkLogin, function (req, res) {
    var note = new db_note({
        title: req.body.title,
        author: req.session.username,
        tag: req.body.tag,
        content: req.body.content,
    });

    note.save(function (err, doc) {
        if (err) {
            console.log(err);
            return res.redirect('/post');
        }
        if (doc) {
            console.log('Publish Success！');
        }
        return res.redirect('/index');
    });
});

app.get('/index', checkLogin, function (req, res) {
    db_note.find({ author: req.session.username }, function (err, arts) {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        res.render('index', {
            title: 'Note List',
            user: req.session.username,
            page: 'index',
            arts: arts,
        });
    });
});

app.get('/detail/:_id', checkLogin, function (req, res) {
    db_note.findOne({ _id: req.params._id }, function (err, art) {
        if (err) {
            console.log(err);
        }
        if (art) {
            res.render('detail', {
                title: 'Detail',
                user: req.session.username,
                page: 'detail',
                art: art,
            });
        }
    });
});

app.post('/delete/:_id', checkLogin, function (req, res) {
    db_note.findOne({ _id: req.params._id }, function (err, art) {
        if (err) {
            console.log(err);
        }
        if (art) {
            db_note.deleteOne(art, function (err, art) {
                if (err) {
                    console.log(err);
                }
                if (art) {
                    console.log('Delete Successfully');
                    res.redirect('/index');
                }
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

app.listen(3000, function () {
    console.log('app is running on the port 3000');
});

module.exports = app;
