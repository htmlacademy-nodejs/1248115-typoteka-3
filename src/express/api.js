'use strict';

const axios = require(`axios`);
const {HttpMethod, DefaultPort} = require(`../constants`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || DefaultPort.SERVICE;
const defaultURL = `http://localhost:${port}/api/`;

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limitPage, comments, limitSection} = {}) {
    return this._load(`/articles`, {params: {offset, limitPage, comments, limitSection}});
  }

  getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/category`, {params: {count}});
  }

  getCategory({categoryId, limitPage, offset, comments} = {}) {
    return this._load(`/category/${categoryId}`, {params: {limitPage, offset, comments}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  getComments(limit) {
    return this._load(`/comments`, {params: {limit}});
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  removeArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  removeComment(commentId) {
    return this._load(`/comments/${commentId}`, {
      method: HttpMethod.DELETE,

    });
  }

  createCategory(data) {
    return this._load(`/category`, {
      method: HttpMethod.POST,
      data
    });
  }

  editCategory(id, data) {
    return this._load(`/category/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  removeCategory(id) {
    return this._load(`/category/${id}`, {
      method: HttpMethod.DELETE,
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
