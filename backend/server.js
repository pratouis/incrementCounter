import express from 'express';
import { hash, compare } from 'bcrypt';
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
  
});

app.post('/login',(req,res)=>{
  res.status(501).json({success: false, msg: "/login not implemented"});
});

app.post('/increment',(req,res) =>{
  res.status(501).json({success: false, msg: "/increment not implemented"});
});



app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
