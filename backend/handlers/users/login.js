const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getLoggedUserId } = require("../../config/config");
const { guard } = require("../../guards");
const { User } = require("./models/user.model");
const { middlewareLogin } = require("../../middleware/middlewareLogin");

module.exports = (app) => {
  app.post("/users/login", async (req, res) => {
      const { error } = middlewareLogin.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({ message: "Inputs can't be empty" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ message: "email or password is incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log(password);
      return res
        .status(403)
        .json({ message: "email or password is incorrect" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
        IsBusiness: user.IsBusiness,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.send(token);
  });

  app.get("/users", guard, async (req, res) => {
    const users = await User.find().select("-password");

    res.send(users);
  });

  app.get("/users/me", guard, async (req, res) => {
    const { userId } = getLoggedUserId(req, res);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    res.send(user);
  });

  app.get("/users/:id", guard, async (req, res) => {
    const { userId } = getLoggedUserId(req, res);
    const user = await User.findById(userId);

    if (userId !== req.params.id && !user?.isAdmin) {
      return res.status(401).json({ message: "User not authorized" });
    }

    try {
      const user = await User.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }

      res.send(user);
    } catch (err) {
      return res.status(403).json({ message: "User not found" });
    }
  });

  app.patch("/users/:id", guard, async (req, res) => {
    const { userId } = getLoggedUserId(req, res);

    if (userId !== req.params.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const user = await User.findById(req.params.id);
    user.IsBusiness = !user.IsBusiness;
    await user.save();

    res.end();
  });
};
