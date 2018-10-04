import mongoose from 'mongoose';

/*
  Counter collection is connected to User collection through User ID,
    not absolutely necessary, but will help for stronger authentication
    (i.e. user has to provide both id and token in order to increment)

  I decided to associate the token with the Counter schema to limit mongoDB queries
*/
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

/* User collection */

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
const User = mongoose.model('User', UserSchema);

module.exports = { Counter, User };
