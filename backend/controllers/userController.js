const { User } = require('../models');
const userController = {};

// Fetch all users
userController.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.locals.users = users;
    return next();
  } catch (err) {
    return next({
      log: 'Express error handler caught error in getAllUsers - failed to fetch users',
      status: 400,
      message: { err: err.message },
    });
  }
};

module.exports = userController;