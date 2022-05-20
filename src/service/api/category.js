'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const asyncHandler = require(`express-async-handler`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, asyncHandler(async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  }));
};
