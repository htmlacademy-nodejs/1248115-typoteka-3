'use strict';

module.exports = (req, res, next) => {

  const {user} = req.session;

  if (!user) {
    return res.redirect(`/login`);
  }

  if (user.id !== 1) {
    return res.redirect(`/`);
  }

  return next();
};
