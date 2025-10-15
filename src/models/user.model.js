const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['User', 'Manager', 'Admin'],
    default: 'User',
  },
  refreshToken: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
