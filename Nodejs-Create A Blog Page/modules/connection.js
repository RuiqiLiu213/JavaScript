
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//var db = mongoose.connect('mongodb://localhost/notes');

const ATLAS_URI = "mongodb+srv://Admin:admin@cluster0.fbviwuw.mongodb.net/?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose.connect(ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
var db = mongoose.connection;

db.once("open", function () {
    console.log("Connection Successful!");
});

module.exports = { db, mongoose, Schema};
