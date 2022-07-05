'use strict';

const express = require(`express`);
const {HttpCode, ExitCode, API_PREFIX, DefaultPort} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);
const createConnectionDB = require(`../lib/sequelize`);
const createRoutes = require(`../api`);

const app = express();
const logger = getLogger({name: `api`});

module.exports = {
  name: `--server`,
  async run(args) {
    const sequelize = createConnectionDB();

    app.use(express.json());
    app.use(API_PREFIX, createRoutes(sequelize));

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });
      next();
    });

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occured on processing request: ${err.message}`);
    });

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DefaultPort.SERVICE;

    try {
      const server = app.listen(port);
      server.on(`listening`, () => {
        logger.info(`Listening to connections on ${port}`);
      });
      server.on(`error`, (err) => {
        logger.error(`An error occured on server creation: ${err.message}`);
      });
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
