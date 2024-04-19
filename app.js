const express = require('express');
const mongoose = require('mongoose');      

const app = express();
const authroutes = require('./routes/authroutes')
const cookieparser = require('cookie-parser');

// middleware
app.use(express.static('public')); //static middelware  static file
                                   

app.use(express.json())  // => take any json data come with req and pass it to js object to use it 

app.use(cookieparser());

// view engine
app.set('view engine', 'ejs'); // to use ejs

// database connection
const dbURI = 'mongodb+srv://reikomahmoud208:p4Rmd0Y5eeXqbtOr@cluster0.fjtuhff.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000),console.log("Connected to DB And Server is Running"))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authroutes);


  