const bcrypt = require("bcrypt");
const { User } = require("./models/user.model");
const { middlewareUsers } = require("../../middleware/middlewareUser");

module.exports = (app) => {
  // create a new user SignUp //
app.post("/signup", async (req, res) => {
  try {
    const { error } = middlewareUsers.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userInfo = req.body;
    const passUser = await bcrypt.hash(userInfo.password, 10);
    userInfo.password = passUser;
    const user = new User(userInfo);

    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});
};
