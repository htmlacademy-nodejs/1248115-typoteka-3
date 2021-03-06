'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для api.

    Гайд:
      server <command>

      Команды:

      --version:            выводит номер версии
      --help:               печатает этот текст
      --generate <count>    формирует файл mocks.json
      --fill <count>        формирует файл fill-db.sql
      --server <port>       запускает сервер на port
      --filldb <count>      наполняет БД
    `;

    console.log(chalk.gray(text));
  }
};
