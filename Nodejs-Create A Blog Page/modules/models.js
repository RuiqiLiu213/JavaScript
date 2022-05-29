const{ Schema, mongoose} = require("./connection");

var userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	createTime:{
		type:Date,
		default: Date.now()
	}
});

exports.db_user = mongoose.connection.model('db_user', userSchema);


var noteSchema = new Schema({
    title: String,
    author: String,
    tag: String,
    content: String,
    createTime: {
        type: Date,
        default: Date.now()
    }
});

exports.db_note = mongoose.connection.model('db_note', noteSchema);
