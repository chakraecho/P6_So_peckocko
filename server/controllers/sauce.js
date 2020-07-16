const sauces = require('../models/sauce');


exports.getAll = (req, res, next)=>{
    sauces.find()
        .then((sauces)=> {
            console.log(sauces)
            res.status(200).json(sauces)})
        .catch(error => res.status(400).json({error}))
}


exports.createSauce = (req, res, next)=>{
    delete req.body._id;
    console.log(JSON.parse(req.body.sauce))
    const parseSauce = JSON.parse(req.body.sauce)
    const sauce = new sauces({
        userId: parseSauce.userId,
        name : parseSauce.name,
        manufacturer : parseSauce.manufacturer,
        description : parseSauce.description,
        mainPepper : parseSauce.mainPepper,
        heat : parseSauce.heat,
        likes : 0,
        dislikes : 0,
        userLiked: [],
        userDisliked : [],
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/sauces/${req.file.filename}`

    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}