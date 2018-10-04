import express from 'express';
import { hash, compare } from 'bcrypt';
import randtoken from 'rand-token';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
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


app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
  res.status(200).json({success: true, msg: "up and running"});
})

app.post('/register',(req,res)=>{
  const { username, password } = req.body;
  if(!username || !password){
    res.status(400).json({ success: false, msg: "Missing fields" });
  }else{
    User.findOne({ username })
        .then((result)=>{
          if(result){
            res.status(400).json({ success: false, msg: "username already taken" });
          }else{
            const newUser = new User({ username, password })
            return newUser.save();
          }
        })
        .then((save) => {
          res.status(200).json({ success: true, msg: "successful registration" });
        })
        .catch((err) =>{
          res.status(500).json({ success: false, msg: "DB Failure", err });
        });
  }
});

app.post('/login',(req,res)=>{
  const { username, password } = req.body;
  console.log(username, password);
  User.findOne({ username, password })
      .then((result) => {
        if(result){
          console.log(result);
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
      .then((updatedCounter) =>{
          console.log(updatedCounter);
        res.status(200).json({
          success: true,
          msg: "successful login",
          token: updatedCounter.token
        })
      }
      )
      .catch((err) =>
        res.status(500).json({
          success: false,
          msg: "DB Failure",
          err
        })
      );
});

app.post('/increment',(req,res) => {
  const { token, number } = req.body;
  if(!token || !number){
    res.status(400).json({
      success: false,
      msg: "missing information"
    });
  }else{
    // simplifying credentials while removing registration process
    Counter.findOneAndUpdate({ token },{ counter: number })
    // Counter.findOneAndUpdate({ user, token },{ counter: number })
      .then((counter) => {
        console.log(token, counter);
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
        })
      );
  }
});



app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
