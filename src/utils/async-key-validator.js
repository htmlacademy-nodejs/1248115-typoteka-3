'use strict';

const {HttpCode} = require(`../constants`);

class AsyncKeyValidator {
  constructor(schema, duplicate) {
    this._schema = schema;
    this._duplicate = duplicate;
    this.validator = this.validator.bind(this);
  }

  validator(service) {
    return (
      async (req, res, next) => {

        const validateObject = req.body;
        const {error} = this._schema.validate(validateObject, {abortEarly: false});

        const stringMessage = `Значение ${this._duplicate[1]} уже используется`;

        if (error) {
          return res.status(HttpCode.BAD_REQUEST)
              .send(error.details.map((err) => err.message).join(`\n`));
        }

        const duplicateObject = await service.findCompareObject(req.body[this._duplicate[0]]);

        if (duplicateObject) {
          return res.status(HttpCode.BAD_REQUEST)
              .send(stringMessage);
        }

        return next();
      }
    );
  }
}

module.exports = AsyncKeyValidator;
