'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const asyncHandler = require(`express-async-handler`);
const categoryValidator = require(`../middlewares/category-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

const route = new Router();

const ErrorMessage = {
  COUNT: `Категория содержит публикации`,
};

module.exports = (app, service) => {
  app.use(`/category`, route);

  route.get(`/`, asyncHandler(async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  }));

  route.get(`/:categoryId`, routeParamsValidator.validator, asyncHandler(async (req, res) => {
    const {categoryId} = req.params;
    const {limitPage, offset, comments} = req.query;

    const category = await service.findOne(categoryId);

    const {count, articlesByCategory} = await service.findPage(categoryId, limitPage, offset, comments);

    res.status(HttpCode.OK)
      .json({
        category,
        count,
        articlesByCategory
      });
  }));

  route.post(`/`, categoryValidator.validator(service), asyncHandler(async (req, res) => {
    const category = await service.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(category);
  }));

  route.put(`/:categoryId`, [routeParamsValidator.validator, categoryValidator.validator(service)], asyncHandler(async (req, res) => {
    const {categoryId} = req.params;
    const updated = await service.update(categoryId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${categoryId}`);
    }

    return res.status(HttpCode.OK)
        .send(`Updated`);
  }));

  route.delete(`/:categoryId`, routeParamsValidator.validator, asyncHandler(async (req, res) => {
    const {categoryId} = req.params;

    const {count} = await service.findPage(categoryId);

    if (count > 0) {
      return res.status(HttpCode.FORBIDDEN)
        .send(ErrorMessage.COUNT);
    }

    const category = await service.drop(categoryId);

    if (!category) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(category);
  }));
};
