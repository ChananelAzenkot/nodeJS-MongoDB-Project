const jwt = require("jsonwebtoken");
const { getLoggedUserId } = require("./config/config");


exports.guard = (req, res, next) => {
  jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.status(401).send("User not authorized for this user");
    } else {
      next();
    }
  });
};

exports.businessGuard = (req, res, next) => {
  const { IsBusiness, isAdmin } = getLoggedUserId(req, res);

  if (IsBusiness || isAdmin) {
    next();
  } else {
    res.status(401).send("User not authorized");
  }
};

exports.adminGuard = (req, res, next) => {
  const user = getLoggedUserId(req, res);

  if (!user) {
    return res.status(401).send("you don't have permission to do this");
  }

  const { userId, isAdmin } = getLoggedUserId(req, res);

  if (isAdmin || userId === req.params.id) {
    next();
  } else {
    res.status(401).send("User not authorized");
  }
};



