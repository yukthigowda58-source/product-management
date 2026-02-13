const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
})

module.exports = mongoose.model('User', UserSchema)