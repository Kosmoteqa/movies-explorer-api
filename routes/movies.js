const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllMovies, deleteMovieById, createMovies
} = require('../controllers/movies');
const { URLREGEX } = require('../middlewares/validation');

moviesRouter.get('/', getAllMovies);
moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex()
  })
}), deleteMovieById);
moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),

    image: Joi.string().required().regex(URLREGEX),
    trailerLink: Joi.string().required().regex(URLREGEX),
    thumbnail: Joi.string().required().regex(URLREGEX),

    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),

  })
}), createMovies);

module.exports = moviesRouter;
