'use strict';

const {HttpCode, RequestObject} = require(`../constants`);

class KeyValidator {
  constructor(schema, reqObject) {
    this._schema = schema;
    this._reqObject = reqObject;
    this.validator = this.validator.bind(this);
  }

  validator(req, res, next) {

    const validateObject = (this._reqObject === RequestObject.BODY ? req.body : req.params);
    const {error} = this._schema.validate(validateObject, {abortEarly: false});

    if (error) {
      return res.status(HttpCode.BAD_REQUEST)
        .send(error.details.map((err) => err.message).join(`\n`));
    }

    return next();
  }
}

module.exports = KeyValidator;
