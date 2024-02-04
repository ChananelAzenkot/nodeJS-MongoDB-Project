const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getLoggedUserId } = require("../../config/config");
const { guard } = require("../../guards");
const { User } = require("./models/user.model");
const { middlewareLogin } = require("../../middleware/middlewareLogin");
const { json } = require("express");

module.exports = (app) => {
app.post("/users/login", async (req, res) => {
  try {
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
      return res.status(403).json({ message: "email or password is incorrect" });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res
        .status(403)
        .json({
          message:
            "Your account has been locked due to too many failed login attempts. Please try again later.",
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
      }

      await user.save();

      return res.status(403).json({ message: "email or password is incorrect" });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/users", guard, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/users/me", guard, async (req, res) => {
  try {
    const { userId } = getLoggedUserId(req, res);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
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
  try {
    const { userId } = getLoggedUserId(req, res);

    if (userId !== req.params.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.IsBusiness = !user.IsBusiness;
    await user.save();

    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
};
