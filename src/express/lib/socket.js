'use strict';

const {Server} = require(`socket.io`);
const {HttpMethod, DefaultPort} = require(`../../constants`);
const HOST = `localhost`;

module.exports = (server) => {
  return new Server(server, {
    cors: {
      origins: [`${HOST}:${DefaultPort.EXPRESS}`],
      methods: [HttpMethod.GET],
    }
  });
};
