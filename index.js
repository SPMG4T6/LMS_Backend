const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// set up our express app
const app = express();

// connect to mongodb
mongoose.connect(config.MONGODB);
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// initialize routes
app.use('/api',require('./routes/api'));

// error handling middleware
app.use(function(err,req,res,next){
    //console.log(err);
    res.status(422).send({error: err.message});
});

// listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, function(){
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});