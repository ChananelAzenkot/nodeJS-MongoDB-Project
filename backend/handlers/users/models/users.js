const { adminGuard } = require("../../../guards");
const { guard } = require("../../../guards");
const { businessGuard } = require("../../../guards");
const { User } = require("./user.model");
const jwt = require("../../../config/config");
const { getLoggedUserId } = require("../../../config/config");

module.exports = (app) => {
  app.get("/api/users", adminGuard, async (req, res) => {
    const users = await User.find();
    res.send(users);
  });

  app.get("/api/user/:id", adminGuard, guard, async (req, res) => {
    const user = await User.findById(req.params.id);

    const { userId } = getLoggedUserId(req, res);

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send(user);
  });

  app.put("/api/user/:id", adminGuard, guard, async (req, res) => {
    const user = getLoggedUserId(req, res);
    if (!user) return res.status(403).json({ message: "User not authorized" });

    const { userId } = user;
    req.body.userId = userId;

    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    Object.assign(userToUpdate, req.body);

    await userToUpdate.save();

    res.send("User updated successfully");
  });

  app.patch("/api/user/:id", guard, businessGuard, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.IsBusiness = !user.IsBusiness;
    await user.save();

    res.send("User updated " + user.IsBusiness);
  });

  app.delete("/api/user/:id", guard, adminGuard, async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.send("User deleted successfully " + user.name.first);
  });
};
