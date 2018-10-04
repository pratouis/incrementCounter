import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String
  },
  counter: {
    type: Number,
    default: 0
  }
});


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const Counter = mongoose.model('Counter',CounterSchema);
const User = mongoosemodel('User', UserSchema);

module.exports = { Counter, User };
