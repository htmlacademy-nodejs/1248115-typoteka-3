"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Category extends Model {

}

const define = (sequelize) => Category.init({
  name: {
    // eslint-disable-next-line new-cap
    type: DataTypes[`STRING`](250),
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Category`,
  tableName: `categories`
});

module.exports = define;
