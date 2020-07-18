const sauces = require('../models/sauce');
const fs = require('fs');
const { json } = require('body-parser');
const sauce = require('../models/sauce');


exports.getAll = (req, res, next)=>{
    sauces.find()
        .then((sauce)=> {
            res.status(200).json(sauce)})
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

exports.getOne = (req,res, next)=>{
    sauces.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}
exports.modifyOne = (req, res, next)=>{
    console.log(req.body)
    if(req.body.sauce == undefined){                                    //without img update
        sauces.updateOne({_id : req.params.id}, {...req.body})
        .then(()=>{res.status(200).json({message :'sauce mis à jour !'})})
        .catch(error => res.status(400).json({error}))
    }
    else{                                         
//with img update
        let body = JSON.parse(req.body.sauce)
        sauces.findOne({_id : req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/uploads/sauces/')[1];
            fs.unlink(`/uploads/sauces/${filename}`)
        })
        .catch(error => res.status(400).json({error}))
        sauces.updateOne({_id : req.params.id}, {imageUrl: `${req.protocol}://${req.get('host')}/uploads/sauces/${req.file.filename}`,_id: req.params.id, ...body })
        .then(()=> res.status(200).json({message : 'sauce mis à jour !'}))
        .catch(error => res.status(400).json({error}))
    }
}
exports.deleteOne = (req, res, next)=>{
    sauces.findOne({_id : req.params.id})
    .then((sauce)=>{
        const filename = sauce.imageUrl.split('/uploads/sauces')[1];
        fs.unlink(`/uploads/sauces/${filename}`, () => {
            sauces.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
              .catch(error => res.status(400).json({ error }));

    })
    .catch(error => res.status(400).json({error}))

})
}


/*
exports.likeOne = (req,res, next)=>{
    console.log(req.body)
    let userLiked;
    let userDisliked;
    let likes;
    sauce.findOne({_id: req.params.id})
    .then( sauce => {
        userLiked=sauce.userLiked;
        userDisliked = sauce.userDisliked;
        likes = sauce.likes;
    })
    .catch(error => json({error})) 
        if(userLiked.includes(req.body.userId)|| userDisliked.includes(userId)){

        }
    sauce.updateOne({_id: req.params.id},{...req.body  })
        .then(()=>res.status(200).json({message :'sauce mis à jour !'}))
        .catch( error => json({error}))
}*/