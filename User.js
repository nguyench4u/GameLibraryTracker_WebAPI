var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_ROUNDS = 10;

// User schema
// Referenced previous WebAPI assignments 

var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false } // hides password by queried
});

// Before saving the user, hash the password and save it
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// When user logs in, compare hashed password with the password they entered
UserSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

//return the model to server
module.exports = mongoose.model('User', UserSchema);