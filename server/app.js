const express = require('express')
const app = express()
const mongoose = require('mongoose')
const mongoAuth = require('./mongoauth')
const path = require('path');
const helmet = require('helmet');


const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce')
const bodyParser = require('body-parser');

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