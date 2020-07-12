const mongoose = require('mongoose')
const { ObjectID } = require('bson')

sauceSchema = mongoose.Schema({
    id:{type: ObjectID, required:true},
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer : {type: String, required:true},
    description : {type: String, required: true},
    mainPepper:{type: String, required:true},
    imageUrl : {type: String, required: true},
    heat:{type: Number, required:true},
    likes:{type:Number, required: true},
    dislikes: {type:Number, required: true},
    userLiked:{type: [String]},
    userDisliked:{type: [String]}
})

module.exports = mongoose.model('sauce', sauceSchema)