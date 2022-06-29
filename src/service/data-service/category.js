'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`CategoryId`)
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    }
    return this._Category.findAll({raw: true});
  }

  async findOne(categoryId) {
    return this._Category.findByPk(categoryId);
  }

  async findPage(categoryId, limit, offset, needComments) {
    const articlesIdByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const articlesId = articlesIdByCategory.map((articleIdItem) => articleIdItem.ArticleId);

    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: articlesId
      },
      distinct: true
    });

    return {count, articlesByCategory: rows};
  }

  async create(categoryData) {
    const category = await this._Category.create(categoryData);
    return category.get();
  }

  async findCompareObject(name) {
    const category = await this._Category.findOne({
      where: {name}
    });

    return category && category.get();
  }

  async update(id, category) {
    const [affectedRows] = await this._Category.update(category, {
      where: {id}
    });

    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CategoryService;
