const jwt = require("jsonwebtoken");

exports.getLoggedUserId = (req, res) => {
  try {
    if (!req.headers.authorization) {
      return null;
    }

    const data = jwt.decode(req.headers.authorization, process.env.JWT_SECRET);

    if (!data) {
      return res.status(401).json({ message: "User not authorized" });
    }

    return data;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



