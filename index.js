const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// set up our express app
const app = express();

// set up swagger-ui
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.3", // present supported openapi version
    info: {
      title: "LMS Backend API", // short title.
      description: "LMS Backend", //  desc.
      version: "1.0.0", // version number
      // contact: {
      //   name: "John doe", // your name
      //   email: "john@web.com", // your email
      //   url: "web.com", // your website
      // },
    },
    servers: [
      {
        url: "https://lmsbackendapi.herokuapp.com/api/"
      }
    ],
  },
  apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);


// connect to mongodb
mongoose.connect(config.MONGODB);
mongoose.Promise = global.Promise;

// app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// initialize routes
app.use('/api', require('./routes/userAPI'));
app.use('/api', require('./routes/gradeAPI'));
app.use('/api', require('./routes/sectionAPI'));
app.use('/api', require('./routes/classAPI'));
app.use('/api', require('./routes/courseAPI'));
app.use('/api', require('./routes/progressAPI'));
app.use('/api', require('./routes/classAppliedAPI'));
// app.use('/api', require('./routes/forumAPI'));
// app.use('/api', require('./routes/chatAPI'));

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