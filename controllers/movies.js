const NotFound = require('../errors/notFound');
const MovieSchema = require('../models/movie');
const Forbidden = require('../errors/forbidden');
const BadReq = require('../errors/badReq');

module.exports.getAllMovies = (req, res, next) => {
  MovieSchema.find({ owner: req.user._id }).then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  MovieSchema.findById(req.params.movieId).then((movie) => {
    if (!movie) {
      throw new NotFound('Фильм не найден');
    }
    if (!movie.owner.equals(req.user._id)) {
      throw new Forbidden('Доступ запрещен');
    }
    movie.deleteOne().then(() => res.send({ message: 'Фильм удален' })).catch(next);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReq('Передан не коррекный ID'));
      } else {
        next(err);
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const { _id } = req.user;

  MovieSchema.create({ ...req.body, owner: _id }).then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReq('Переданы не валидные данные фильма'));
      } else {
        next(err);
      }
    });
};
