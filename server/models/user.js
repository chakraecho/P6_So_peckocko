const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
})
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user', userSchema)