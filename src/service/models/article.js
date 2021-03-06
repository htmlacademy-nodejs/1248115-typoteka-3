'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {

}

const define = (sequelize) => Article.init({
  fullText: {
    // eslint-disable-next-line new-cap
    type: DataTypes[`STRING`](1000),
  },
  picture: DataTypes[`STRING`],
  title: {
    type: DataTypes[`STRING`],
    allowNull: false
  },
  announce: {
    type: DataTypes[`STRING`],
    allowNull: false
  },
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
