import express from 'express';
import { hash, compare } from 'bcrypt';
import randtoken from 'rand-token';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { Counter, User } from './models';
const app = express();

mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});

mongoose.connect(process.env.MONGODB_URI);


app.use(bodyParser.urlencoded({extended: false}));



app.get('/',(req,res)=>{
  res.status(200).json({success: true, msg: "up and running"});
})

app.post('/register',(req,res)=>{
  const { username, password, email } = req;
  if(!username || !email || !password){
    res.status(400).json({ success: false, msg: "Missing fields" });
  }else{
    User.findOne({ email })
        .then((result)=>{
          if(result){
            res.status(400).json({ success: false, msg: "email already taken" });
          }else{
            return User.save({ username, email, password });
          }
        })
        .then((save) => {
          console.log(save);
          res.status(200).json({ success: true, msg: "successful registration" });
        })
        .catch((err) =>
        res.status(500).json({ success: false, msg: "DB Failure", err })
        );
  }
});

app.post('/login',(req,res)=>{
  const { email, password }
  User.findOne({ email, password })
      .then((result) => {
        if(result){
          return Counter.findOneAndUpdate(
            { user: result._id},
            { token: randtoken.generate(16) },
            { upsert: true })
        }else{
          res.status(400).json({
            success: false,
            msg: "Login failed"
          });
        }
      })
      .then((updatedCounter) =>
          res.status(200).json({
            success: true,
            msg: "successful login",
            token: updatedCounter.token
          });
      )
      .catch((err) =>
        res.status(500).json({
          success: false,
          msg: "DB Failure",
          err
        });
      );
});

app.post('/increment',(req,res) => {
  const { token, user, number } = req;
  if(!token || !user){
    res.status(400).json({
      success: false,
      msg: "missing credentials"
    })
  }else if(!number){
    res.status(400).json({
      success: false,
      msg: "missing number"
    });
  }else{
    Counter.findOneAndUpdate({ user, token },{ counter: number })
      .then((counter) => {
        if(!counter){
          res.status(400).json({
            success: false,
            msg: "incorrect credentials"
          });
        }else{
          res.status(200).json({
            success: true,
            msg: "successfully incremented!"
          });
        }
      })
      .catch((err) =>
        res.status(500).json({
          success: false,
          msg: "DB Failure",
          err
        });
      );
  }
});



app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
