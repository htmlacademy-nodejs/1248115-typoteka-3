'use strict';

const express = require(`express`);
const mainRoutes = require(`./routes/main-routes`);

const app = express();
const DEFAULT_PORT = 8080;

app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT);
