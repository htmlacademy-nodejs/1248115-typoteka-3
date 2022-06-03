'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const userValidator = require(`../middlewares/user-validator`);
const passwordUtils = require(`../lib/password`);
const asyncHandler = require(`express-async-handler`);

const route = new Router();
/*
const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};
*/
module.exports = (app, service) => {
  app.use(`/user`, route);

  route.post(`/`, userValidator(service), asyncHandler(async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await service.create(data);

    delete result.passwordHash;

    res.status(HttpCode.CREATED)
      .json(result);
  }));
};
