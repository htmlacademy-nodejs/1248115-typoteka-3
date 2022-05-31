'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findOne(articleId, needComments) {
    const options = {
      include: [
        Aliase.CATEGORIES,
      ],
      where: [{
        id: articleId
      }]
    };

    if (needComments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS
      });

      options.order = [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ];
    }

    return await this._Article.findOne(options);
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });

    const updatedArticle = await this._Article.findOne({
      where: {
        id
      }
    });

    await updatedArticle.setCategories(article.categories);

    return !!affectedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((item) => item.get());
  }

  async findPage({limit, offset, comments}) {
    const include = [Aliase.CATEGORIES];

    if (comments) {
      include.push(Aliase.COMMENTS);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, articles: rows};
  }

}

module.exports = ArticleService;
