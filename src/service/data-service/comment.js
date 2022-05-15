'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findTotal() {
    const include = [Aliase.ARTICLES];

    const comments = await this._Comment.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return comments.map((item) => item.get());
  }
}

module.exports = CommentService;
