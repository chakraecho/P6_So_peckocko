const express = require('express')
const app = express()
const mongoose = require('mongoose')
const mongoAuth = require('./mongoauth')

const sauceRoutes = require('./routes/sauce')

app.use('/api/auth', sauceRoutes)

module.exports = app