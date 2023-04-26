const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundErr = require('../errors/NotFoundErr');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const userRouter = require('./users');
const moviesRouter = require('./movies');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.use('/users', auth, userRouter);
router.use('/movies', auth, moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundErr('404 Not Found'));
});

module.exports = router;
