/* backend server for increment Counter
 allows for POST login, register, and increment calls
 persisting users and their counters in the backend
*/
import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';

import randtoken from 'rand-token';
import mongoose from 'mongoose';
import { Counter, User } from './models';
const app = express();

mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDB!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDB. Check MONGODB_URI in env.sh');
  process.exit(1);
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

/* middleware */
/* allows us to pass browser's No Access-Control-Allow-Origin */
app.use(cors());
/* allows for bodies of requests to be read */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.post('/register',(req,res)=>{
  const { username, password } = req.body;
  /* checking if fields are valid inputs */
  if(!username || !password){
    res.status(400).json({ success: false, msg: "Missing fields" });
  }else{
    /* checking if username taken */
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
  /* checking if fields are valid inputs */
  if(!username || !password){
    res.status(400).json({ success: false, msg: "Missing fields" });
  }else{
    User.findOne({ username, password })
        .then((result) => {
          if(result){
            /* update or insert Counter record with newly generated token,
                returning new document upon succes
             */
            return Counter.findOneAndUpdate(
              { user: result._id},
              { token: randtoken.generate(16) },
              { upsert: true, new: true })
          }else{
            res.status(400).json({
              success: false,
              msg: "Login failed"
            });
          }
        })
        .then((updatedCounter) =>{
          /* send token, to be used for authentication during current "session",
            * and old counter
           */
          res.status(200).json({
            success: true,
            msg: "successful login",
            token: updatedCounter.token,
            counter: updatedCounter.counter || 0
          })
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

app.post('/increment',(req,res) => {
  const { token, number } = req.body;
  /* check if fields are valid */
  if(!token || !number){
    res.status(400).json({
      success: false,
      msg: "missing information"
    });
  }else{
    Counter.findOneAndUpdate({ token },{ counter: number })
      .then((counter) => {
        if(!counter){
          /* an empty or null counter means token incorrect */
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
