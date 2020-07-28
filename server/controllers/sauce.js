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
        ...saniSauce,
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/sauces/${req.file.filename}`

    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.getOne = (req,res, next)=>{
    const id = sanitize(req.params.id)
    Sauces.findOne({_id: id})
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

    
    const id = sanitize(req.params.id)


    Sauces.findOne({_id:id})
    .then( sauce => {
        console.log(req.body)
        userLiked= sauce.usersLiked;
        userDisliked = sauce.usersDisliked;
        likes = sauce.likes;
        dislikes = sauce.dislikes

        const userId = sanitize(req.body.userId)

            const like = sanitize(req.body.like)
            switch (req.body.like){
                case 1 :  //like
            
                    Sauces.updateOne({_id : req.params.id}, {$inc:{likes: 1}, $push:{usersLiked: userId}})
                    .then(()=>res.status(200).json({message : 'like !'}))
                    .catch(error => res.status(400).json({error}))
                
    
                    break;
                case 0:  //remove like

                    if(userLiked.includes(userId)){
                        Sauces.updateOne({_id : req.params.id}, {$pull:{usersLiked : userId}, $inc:{likes : -1}})
                        .then(()=>res.status(200).json({message : 'like retiré !'}))
                        .catch(error => res.status(400).json({error}))
    
                    }
                    else if (userDisliked.includes(userId)){
                        
                        Sauces.updateOne({_id : req.params.id}, {$pull:{usersDisliked : userId}, $inc:{dislikes : -1}})
                        .then(()=>res.status(200).json({message : 'dislike retiré !'}) )
                        .catch(error => res.status(400).json({error}))
                    }
                    break;

                case -1:  //dislike
                   
                    Sauces.updateOne({_id : req.params.id}, {$inc:{dislikes: 1}, $push:{usersDisliked: userId}})
                    .then(()=>res.status(200).json({message : 'disliké !'}))
                    .catch(error => res.status(400).json({error}))
                
    
                    break;
            }
        
    })
    .catch(error => json({error})) 

}