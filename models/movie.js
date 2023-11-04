const mongoose = require('mongoose');
const { URLREGEX } = require('../middlewares/validation');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => URLREGEX.test(v),
      message: 'Не вылидный адрес'
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => URLREGEX.test(v),
      message: 'Не вылидный адрес'
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => URLREGEX.test(v),
      message: 'Не вылидный адрес'
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
