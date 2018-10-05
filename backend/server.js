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
        .then((userDoc) => {
          if(userDoc){
            /* update or insert Counter record with newly generated token,
                returning new document upon succes
             */
            return Counter.findOneAndUpdate(
              { user: userDoc._id},
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

app.get('/increment', (req,res) => {
  const { token, counter } = req.query;
  if(!token || counter === null || counter === undefined){
    res.status(400).json({
      success: false,
      msg: "missing information"
    });
  }else{
    console.log('in GET /increment')
    res.status(200).json({
      success: true,
      msg: 'suggesting new count',
      newCount: Math.max(1, counter*2)
    });
  }
})

app.post('/increment',(req,res) => {
  const { token, counter } = req.body;
  /* check if fields are valid */
  if(!token || counter === undefined || counter === null ){
    res.status(400).json({
      success: false,
      msg: "missing information"
    });
  }else{
    Counter.findOneAndUpdate({ token },{ counter })
      .then((counterDoc) => {
        if(!counterDoc){
          /* an empty or null counter means token incorrect */
          res.status(400).json({
            success: false,
            msg: "incorrect credentials"
          });
        }else{
          res.status(200).json({
            success: true,
            msg: `successfully ${counter ? 'incremented' : 'reset'}!`
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

app.get('/logout', (req,res) => {
  /* check if fields are valid */
  if(!req.query.token){
    res.status(400).json({
      success: false,
      msg: "missing token"
    });
  }else{
    /* "securetly" logs out a person by removing their "session" token from DB
    *   prevents altering counter with old token after someone has logged out
    */
    Counter.findOneAndUpdate({ token: req.query.token }, { token: ""})
    .then((counterDoc) => {
      if(!counterDoc){
        res.status(400).json({
          success: false,
          msg: "incorrect credentials"
        });
      }else{
        res.status(200).json({
          success: true,
          msg: 'successfully logged out!'
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
