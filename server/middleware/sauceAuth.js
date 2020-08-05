const jwt = require('jsonwebtoken');
const sauce = require('../models/sauce');
const sanitize = require('mongo-sanitize')
module.exports = (req, res, next)=>{
    const id = sanitize(req.params.id)
    
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'cle_super_secrete_ne_Devant_Pas_etre_Partage');
        const userId = decodedToken.userId;
        sauce.findOne({_id : id})
        .then(sauce =>{
            if (sauce.userId !== userId) {
                res.status(401).json({message:'action non autorisé !'})
              } else {
                next();
              }
        })
        .catch(error => res.status(500).json({error}))
      
}