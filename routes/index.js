const router = require('express').Router();
const NotFound = require('../errors/notFound');
const movieRouter = require('./movies');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => {
  next(new NotFound('Путь не найден'));
});

module.exports = router;
