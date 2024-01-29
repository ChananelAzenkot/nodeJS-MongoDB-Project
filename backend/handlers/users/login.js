const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getLoggedUserId } = require("../../config/config");
const { guard } = require("../../guards");
const { User } = require("./models/user.model");

module.exports = (app) => {
  app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).send("Inputs can't be empty");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).send("email or password is incorrect 1");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log(password);
      return res.status(403).send("email or password is incorrect 2");
    }

    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
        isBusiness: user.isBusiness,
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
      return res.status(403).send("User not found");
    }

    res.send(user);
  });

  app.get("/users/:id", guard, async (req, res) => {
    const { userId } = getLoggedUserId(req, res);
    const user = await User.findById(userId);

    if (userId !== req.params.id && !user?.isAdmin) {
      return res.status(401).send("User not authorized");
    }

    try {
      const user = await User.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(403).send("User not found");
      }

      res.send(user);
    } catch (err) {
      return res.status(403).send("User not found");
    }
  });

  app.patch("/users/:id", guard, async (req, res) => {
    const { userId } = getLoggedUserId(req, res);

    if (userId !== req.params.id) {
      return res.status(401).send("User not authorized");
    }

    const user = await User.findById(req.params.id);
    user.isBusiness = !user.isBusiness;
    await user.save();

    res.end();
  });
};
