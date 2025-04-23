const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: 'User created!',
        result: result
      });
    })
    .catch(err => {
      console.log(err);  // Agregar logging para detectar posibles problemas
      res.status(500).json({
        message: 'Invalid authentication credentials'
      });
    })
  })
  .catch(err => {
    console.log(err);  // Agregar logging por si el hash falla
    res.status(500).json({
      message: 'Password hashing failed',
      error: err
    });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    console.log('User found:', user);  // Para ver si el usuario es encontrado
    if(!user) {
      return res.status(401).json({
        message: 'Auth failed - user not found'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: 'Auth failed - incorrect password'
      });
    }
    const token = jwt.sign({
      email: fetchedUser.email,
      userId: fetchedUser._id
    }, process.env.JWT_KEY , { expiresIn: '1h' });

    res.status(200).json({
      token: token,
      expiresIn: '3600',  // Debe ser en segundos (3600 = 1 hora)
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    console.log(err);  // Agregar logging para ver el error exacto
    return res.status(500).json({
      message: 'Auth failed',
      error: err
    });
  });
}
