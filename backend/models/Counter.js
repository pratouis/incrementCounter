import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  counter: {
    type: Number,
    required: true
  }
});

const Counter = mongoose.model('Counter',CounterSchema);

module.exports = Counter;
