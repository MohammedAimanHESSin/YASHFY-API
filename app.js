const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const app = express();
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
//dummy to start the server
app.use('/', (req,res,next)=>{
    console.log('Start Server')
});

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
