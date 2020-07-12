const express = require('express')
const app = express()
const mongoose = require('mongoose')
const mongoAuth = require('./mongoauth')

const userRoutes = require('./routes/user');

app.use('/api/auth', userRoutes)

module.exports = app