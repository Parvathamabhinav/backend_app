const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydatabase');
const userSchema = new mongoose.Schema({
    name: String,       
    email: { type: String, unique: true },
    password: String
});
const user = mongoose.model('user', userSchema);
module.exports = user;    