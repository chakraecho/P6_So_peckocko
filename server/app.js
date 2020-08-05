const express = require('express')
const app = express()

const path = require('path');
const helmet = require('helmet');
const toobusy = require('toobusy-js')
const env = require('dotenv')

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce')
const bodyParser = require('body-parser');

env.config() //IMPORT env var

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL,  //PLEASE SET DB_URL Var in .env file
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(function (req, res, next) {
  if (toobusy()) {
    res.send(503, "Server Too Busy");
  } else {
    next();
  }
});
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json())

app.use('/uploads/sauces', express.static(path.join(__dirname, '/uploads/sauces')));

app.use('/api/auth', userRoutes)

app.use('/api/sauces', sauceRoutes)


module.exports = app