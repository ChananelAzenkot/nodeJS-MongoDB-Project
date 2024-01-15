const mongoose = require("mongoose");
const guard = require("../../guard");

module.exports = (app) => {
  const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
  });

  const Client = mongoose.model("clients", schema);

  app.get("/clients", guard, async (req, res) => {
    res.send(await Client.find());
  });

  app.get("/clients/:id", guard, async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).send("Client not found");
    }

    res.send(client);
  });

  app.post("/clients", guard, async (req, res) => {
    const client = new Client(req.body);
    const newClient = await client.save();
    res.send(newClient);
  });

  app.put("/clients/:id", guard, async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).send("Client not found");
    }

    client.firstName = req.body.firstName;
    client.lastName = req.body.lastName;
    client.phone = req.body.phone;
    client.email = req.body.email;

    const updatedClient = await client.save();
    res.send(updatedClient);
  });

  app.delete("/clients/:id", guard, async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).send("Client not found");
    }

    await client.remove();
    res.send(client);
  });
};
