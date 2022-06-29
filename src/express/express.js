'use strict';

const express = require(`express`);
const session = require(`express-session`);
const http = require(`http`);
const socket = require(`./lib/socket`);
const sequelize = require(`../service/lib/sequelize`)();
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const mainRoutes = require(`./routes/main-router`);
const myRoutes = require(`./routes/my-router`);
const articlesRoutes = require(`./routes/articles-router`);
const path = require(`path`);
const {HttpCode, DefaultPort} = require(`../constants`);
const ExpirationSessionParam = {
  EXPIRATION_SESSION: 180000,
  CHECK_EXPIRATION_INTERVAL_SESSION: 60000
};
const Direction = {
  PUBLIC: `public`,
  UPLOAD: `upload`
};

const app = express();
const server = http.createServer(app);
const io = socket(server);
app.locals.socketio = io;

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: ExpirationSessionParam.EXPIRATION_SESSION,
  checkExpirationInterval: ExpirationSessionParam.CHECK_EXPIRATION_INTERVAL_SESSION
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use(express.static(path.resolve(__dirname, Direction.PUBLIC)));
app.use(express.static(path.resolve(__dirname, Direction.UPLOAD)));

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((err, req, res, _next) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

server.listen(DefaultPort.EXPRESS);
