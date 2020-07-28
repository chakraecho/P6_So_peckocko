const Sauces = require('../models/sauce');
const fs = require('fs');
const { json } = require('body-parser');
const User = require('../models/user');
const sanitize = require('mongo-sanitize')

exports.getAll = (req, res, next)=>{
    Sauces.find()
        .then((sauce)=> {
            res.status(200).json(sauce)})
        .catch(error => res.status(400).json({error}))
}


exports.createSauce = (req, res, next)=>{
    delete req.body._id;
    console.log(JSON.parse(req.body.sauce))
    const parseSauce = JSON.parse(req.body.sauce)
    const saniSauce = sanitize(parseSauce)
    const sauce = new Sauces({
        userId: saniSauce.userId,
        name : saniSauce.name,
        manufacturer : saniSauce.manufacturer,
        description : saniSauce.description,
        mainPepper : saniSauce.mainPepper,
        heat : saniSauce.heat,
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
    const id = sanitize(req.params.id)
    Sauces.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}
exports.modifyOne = (req, res, next)=>{
    console.log(req.body)
    const id = sanitize(req.params.id)

    if(req.body.sauce == undefined){           
        const body = sanitize(req.body)
        const sauce = sanitize(req.body.sauce)                         //without img update
        Sauces.updateOne({_id : id}, {...body})
        .then(()=>{res.status(200).json({message :'sauce mis à jour !'})})
        .catch(error => res.status(400).json({error}))
    }
    else{                                         
//with img update
        let parseSauce = JSON.parse(req.body.sauce)
        const saniSauce = sanitize(parseSauce)
        Sauces.findOne({_id : id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/uploads/sauces/')[1];
            fs.unlink(`/uploads/sauces/${filename}`)
        })
        .catch(error => res.status(400).json({error}))
        Sauces.updateOne({_id : req.params.id}, {imageUrl: `${req.protocol}://${req.get('host')}/uploads/sauces/${req.file.filename}`,_id: id, ...saniSauce })
        .then(()=> res.status(200).json({message : 'sauce mis à jour !'}))
        .catch(error => res.status(400).json({error}))
    }
}
exports.deleteOne = (req, res, next)=>{
    const id = sanitize(req.params.id)
    Sauces.findOne({_id : id})
    .then((sauce)=>{
        const filename = sauce.imageUrl.split('/uploads/sauces')[1];
        fs.unlink(`/uploads/sauces/${filename}`, () => {
            Sauces.deleteOne({ _id: id })
              .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
              .catch(error => res.status(400).json({ error }));

    })
    .catch(error => res.status(400).json({error}))

})
}


exports.likeOne = (req,res, next)=>{
    console.log(req.body)
    let userLiked = [];
    let userDisliked = [];
    let likes = 0;
    const userId = sanitize(req.body.userId)
    const id = sanitize(req.params.id)


    Sauces.findOne({_id:id})
    .then( sauce => {

        userLiked= sauce.userLiked;
        userDisliked = sauce.userDisliked;
        likes = sauce.likes;
        dislikes = sauce.dislikes

        if(userLiked.includes(userId) || userDisliked.includes(userId)){
            return res.status(200).json({message:'vous avez déjà liké la sauce !'})
        }
        else{
            const like = sanitize(req.body.like)
            switch (req.body.like){
                case 1 :  //like
                if(!userLiked.includes(req.body.userId)){
                    likes++
                    userLiked.push(req.body.userId)
                    Sauces.updateOne({_id : req.params.id}, {likes, userLiked})
                    .then(()=>res.status(200).json({message : 'like !'}))
                    .catch(error => res.status(400).json({error}))
                }
    
    
                    break;
                case 0:  //remove like
                    if(userLiked.includes(req.body.userId)){
                        likes--
                        let index = userLiked.indexOf(req.body.userId)
                        console.log(index)
                        userLiked.splice(index, 1)
                        Sauces.updateOne({_id : req.params.id}, {likes, userLiked})
                        .then(()=>res.status(200).json({message : 'like retiré !'}))
                        .catch(error => res.status(400).json({error}))
    
                    }
                    else if (userDisliked.includes(req.body.userId)){
                        dislikes--
                        let index = userDisliked.indexOf(req.body.userId)
                        userDisliked.splice(index, 1)
                        Sauces.updateOne({_id : req.params.id}, {dislikes, userDisliked})
                        .then(()=>res.status(200).json({message : 'dislike retiré !'}) )
                        .catch(error => res.status(400).json({error}))
                    }
                    break;
                case -1:  //dislike
                if(!userDisliked.includes(req.body.userId)){
                    dislikes++
                    userDisliked.push(req.body.userId)
                    Sauces.updateOne({_id : req.params.id}, {dislikes, userDisliked})
                    .then(()=>res.status(200).json({message : 'disliké !'}))
                    .catch(error => res.status(400).json({error}))
                }
    
                    break;
            }
        }     
    })
    .catch(error => json({error})) 

}