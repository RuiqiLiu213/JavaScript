function login(req, res, next) {
    if(req.session.user) {
        console.log('Already logged in!');
        
    }
    next();
}

function noLogin(req, res, next) {
    if(!req.session.user) {
        console.log('Have not logged in yet');
        return res.redirect('/login');
    }
    next();
}

exports.login = login;
exports.noLogin = noLogin;