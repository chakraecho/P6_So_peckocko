const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

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
        type: Number,
        required : true
    }
})
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user', userSchema)