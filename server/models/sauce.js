const mongoose = require('mongoose')


sauceSchema = mongoose.Schema({
    id: {
        type: String,
    },
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
    },
    dislikes: {
        type: Number,
    },
    usersLiked: {
        type: [String]
    },
    usersDisliked: {
        type: [String]
    }
})

module.exports = mongoose.model('sauce', sauceSchema)