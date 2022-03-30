'use strict';

const express = require(`express`);
const mainRoutes = require(`./routes/main-router`);
const myRoutes = require(`./routes/my-router`);
const articlesRoutes = require(`./routes/articles-router`);
const path = require(`path`);

const app = express();
const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, req, res, next) => res.status(500).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT);
