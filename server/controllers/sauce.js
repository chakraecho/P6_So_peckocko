const sauces = require('../models/sauce')

exports.createSauce = (req, res, next)=>{
    delete req.body._id;

}