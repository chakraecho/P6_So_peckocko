const bcrypt = require('bcrypt')
const User = require('./../models/user')
const jwt = require('jsonwebtoken')
const sanitize = require('mongo-sanitize')

exports.signup = (req, res, next) => {
  const mail = sanitize(req.body.email)
  const password = sanitize(req.body.password)
  bcrypt.hash(password, 10)
    .then(hash => {
      const user = new User({
        email: mail,
        password: hash,
        wrongPassword: 0
      });
      user.save()
        .then(() => res.status(201).json({
          message: 'Utilisateur créé !'
        }))
        .catch(error => res.status(400).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};

exports.login = (req, res, next) => {
  const mail = sanitize(req.body.email)
  const password = sanitize(req.body.password)
  User.findOne({ email: mail })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      else{
        bcrypt.compare(password, user.password)
        .then(valid => {
          if (!valid) {
            User.updateOne({email : mail}, {$inc : {wrongPassword : +1}})
            .then(()=> console.log(user.wrongPassword))
            .catch(error => error)
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          else if(user.wrongPassword > 5 ){
            return res.status(400).json({ message: 'compte bloqué, veuillez contacter un administrateur'})
          }
          else if(valid){
            return res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          }
          
        })
        .catch(error => res.status(500).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
};