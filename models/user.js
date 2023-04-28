const validatorUser = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
    minlength: [2, 'Имя пользователя: минимум 2 символа, а у вас {VALUE}'],
    maxlength: [30, 'Имя пользователя: превышенно колличесво символов'],
  },
  email: {
    type: String,
    unique: true,
    required: [true],
    validate: {
      validator: (value) => validatorUser.isEmail(value),
      massage: 'Invalid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false, // You should be aware of the outcome after set to false
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedErr('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedErr('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
