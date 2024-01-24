const bcrypt = require("bcrypt");
const { User } = require("./models/user.model");

module.exports = (app) => {
  app.post("/signup", async (req, res) => {
    try {
      const userInfo = req.body;
      const passUser = await bcrypt.hash(userInfo.password, 10);
      userInfo.password = passUser;
      const user = new User(userInfo);

      await user.save();
      res.status(201).send("User created successfully");
    } catch (error) {
        if(error.code === 11000){
            res.status(409).send("email already exists");
        }
    }
  });
};
