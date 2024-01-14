const mongoose = require('mongoose');
const { User } = require("./user.model");
const { getLoggedUserId } = require("../../config");
const guard = require("../../guard");

module.exports = app => {
    const schema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
    });

    const Client = mongoose.model("clients", schema);

    app.get("/clients/all-group", guard , async (req, res) => {
      res.send(await Client.find());
    });

    app.get("clients/:id", guard, async (req, res) => {
      res.send(await Client.findById(req.params.id));
    });
    
    app.put("clients/:id",guard , async (req, res) => {
      res.send(await Client.findById(req.params.id));
    });

      app.patch("/clients/:id", guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);

        if (userId !== req.params.id) {
          return res.status(401).send("User not authorized");
        }

        const user = await User.findById(req.params.id);

        user.isBusiness = !user.isBusiness;

        await user.save();

        res.end();
      });

      app.delete("/clients/:id", guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);

        if (userId !== req.params.id) {
          return res.status(401).send("User not authorized");
        }

        await User.findByIdAndDelete(req.params.id);

        res.end();
      });
}