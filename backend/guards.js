const jwt = require("jsonwebtoken");
const { getLoggedUserId } = require("./config/config");

// verify the token for the user as guard //
exports.guard = (req, res, next) => {
  try {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        throw new Error("User not authorized for this user");
      } else {
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// verify the token for the user as businessGuard //
exports.businessGuard = (req, res, next) => {
  try {
    const { IsBusiness, isAdmin } = getLoggedUserId(req, res);

    if (IsBusiness || isAdmin) {
      next();
    } else {
      res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// verify the token for the user as adminGuard //
exports.adminGuard = (req, res, next) => {
  try {
    const user = getLoggedUserId(req, res);

    if (!user) {
      return res.status(401).json({ message: "you don't have permission to do this" });
    }

    const { userId, isAdmin } = getLoggedUserId(req, res);

    if (isAdmin || userId === req.params.id) {
      next();
    } else {
      res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





