const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const lockout = require('mongoose-account-locking')

userSchema = mongoose.Schema({
    userId: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    wrongPassword : {
        type: Number
    }
})
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user', userSchema)