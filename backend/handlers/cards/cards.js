const { guard } = require("../../guards");
const {businessGuard} = require("../../guards");
const { Card } = require("../cards/cards.model");
const jwt = require("../../config/config");

module.exports = (app) => {
  app.get("/api/cards", async (req, res) => {
    const cards = await Card.find();
    res.send(cards);
  });

  app.get("/api/my-cards", guard, async (req, res) => {
    const cards = await Card.find({ userId: req.userId });
    res.send(cards);
  });

  app.get("/api/cards/:id", async (req, res) => {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).send("Card not found");
    }

    res.send(card);
  });

  app.post("/api/cards", businessGuard, async (req, res) => {
    const { getTokenParams } = jwt(req.headers.authorization,process.env.JWT_SECRET);
    const { userId } = getTokenParams(req, res);
    req.body.userId = userId;
    if (!req.body.userId) {
      return res.status(403).send("User not authorized");
    }else{
      const card = new Card(req.body);
      const newCard = await card.save();
      res.send(newCard);
    }
  });

  app.put('/api/cards/:id', businessGuard, async (req, res) => {
    const { getTokenParams } = jwt(req.headers.authorization,process.env.JWT_SECRET);
    const { userId } = getTokenParams(req, res);
    req.body.userId = userId;
    if (!req.body.userId) {
      return res.status(403).send("User not authorized");
    }else{
      const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!card) {
        return res.status(404).send('Card not found');
      }

      res.send(card);
    }
  });

  app.delete("/api/cards/:id", businessGuard, async (req, res) => {
    const { getTokenParams } = jwt(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const { userId } = getTokenParams(req, res);
    req.body.userId = userId;
    if (!req.body.userId) {
      return res.status(403).send("User not authorized");
    } else {
      const card = await Card.findByIdAndRemove(req.params.id);

      if (!card) {
        return res.status(404).send("Card not found");
      }

      res.send(card);
    }
  });
};
