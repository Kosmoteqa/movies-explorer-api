require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');
const NotFound = require('../errors/notFound');
const BadReq = require('../errors/badReq');
const Unauthorized = require('../errors/unauthorized');
const Conflict = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashPassword) => {
      UserSchema.create({
        name, email, password: hashPassword
      }).then((user) => res.status(201).send({
        email: user.email,
        name: user.name,
      }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new Conflict('Переданы не валидные данные пользователя'));
          } else if (err.name === 'ValidationError') {
            next(new BadReq('Переданы не валидные данные пользователя'));
          } else {
            next(err);
          }
        });
    }).catch(next);
};

module.exports.editProfile = (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;
  UserSchema.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadReq('Переданы не коррекныые данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  UserSchema.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new Unauthorized('Пользователь не найден');
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return next(new Unauthorized('Пользователь не найден'));
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
      return res.send({ token });
    });
  })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  UserSchema.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFound('Пользователь не найден');
    }
    return res.send(user);
  })
    .catch(next);
};
