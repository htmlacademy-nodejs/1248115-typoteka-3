'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.send(`/`));
mainRouter.get(`/register`, (req, res) => res.send(`/register`));
mainRouter.get(`/login`, (req, res) => res.send(`/login`));
mainRouter.get(`/my`, (req, res) => res.send(`/my`));
mainRouter.get(`/my/comments`, (req, res) => res.send(`/my/comments`));
mainRouter.get(`/articles/category/:id`, (req, res) => res.send(`/articles/category/:id  ${req.params.id}`));
mainRouter.get(`/articles/add`, (req, res) => res.send(`/articles/add`));
mainRouter.get(`/search`, (req, res) => res.send(`/search`));
mainRouter.get(`/articles/edit/:id`, (req, res) => res.send(`/articles/edit/:id ${req.params.id}`));
mainRouter.get(`/articles/:id`, (req, res) => res.send(`/articles/:id ${req.params.id}`));
mainRouter.get(`/my/categories`, (req, res) => res.send(`/my/categories`));

module.exports = mainRouter;
