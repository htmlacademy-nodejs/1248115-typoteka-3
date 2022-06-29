'use strict';

const Joi = require(`joi`);
const {DuplicateParam} = require(`../../constants`);
const {AsyncKeyValidator} = require(`../../utils/utils`);

const ErrorMessage = {
  FIRST_NAME: `Имя содержит некорректные символы`,
  LAST_NAME: `Фамилия содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Тип изображения не поддерживается`
};

const schema = Joi.object({
  firstName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).messages({
    'string.pattern.base': ErrorMessage.FIRST_NAME
  }).required(),
  lastName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).messages({
    'string.pattern.base': ErrorMessage.LAST_NAME
  }).required(),
  email: Joi.string().email().required().messages({
    'string.email': ErrorMessage.EMAIL
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': ErrorMessage.PASSWORD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).messages({
    'any.only': ErrorMessage.PASSWORD_REPEATED
  }),
  avatar: Joi.string().allow(``).pattern(/\S+(\.jpg|\.jpeg|\.png)$/).messages({
    'string.pattern.base': ErrorMessage.AVATAR
  }),
});

module.exports = new AsyncKeyValidator(schema, DuplicateParam.EMAIL);
