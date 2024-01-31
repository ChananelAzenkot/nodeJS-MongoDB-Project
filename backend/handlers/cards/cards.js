const { guard, adminGuard } = require("../../guards");
const { businessGuard } = require("../../guards");
const { Card } = require("../cards/cards.model");
const { getLoggedUserId } = require("../../config/config");

module.exports = (app) => {
  app.get("/api/cards", async (req, res) => {
    const cards = await Card.find();
    res.send(cards);
  });

  app.get("/api/my-cards", guard, async (req, res) => {
    try {
      const { userId } = getLoggedUserId(req, res);

      if (!userId) {
        return res.status(403).send("User not authorized");
      }
      const cards = await Card.find({ user_id: userId });

      if (!cards || cards.length === 0) {
        return res.status(404).send("No cards found for this user");
      }
      res.send(cards);
    } catch (error) {
      console.log(error);
      res.status(500).send(" Server Error");
    }
  });

  app.get("/api/card/:id", async (req, res) => {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).send("Card not found");
    }

    res.send(card);
  });
app.post("/api/addCard", businessGuard, async (req, res) => {
  const { userId } = getLoggedUserId(req, res);

  if (!userId) {
    return res.status(403).send("User not authorized");
  }

  req.body.user_id = userId;

  const card = new Card(req.body);
  const newCard = await card.save();
  res.send(newCard);
});

  app.put("/api/card/:id", businessGuard, async (req, res) => {
    const { userId } = getLoggedUserId(req, res);
    req.body.userId = userId;
    if (!req.body.userId) {
      return res.status(403).send("User not authorized");
    } else {
      const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!card) {
        return res.status(404).send("Card not found");
      }

      res.send(card + "Card updated successfully");
    }
  });

app.patch("/api/cardLike/:id", businessGuard, async (req, res) => {
  const { userId } = getLoggedUserId(req, res);
  if (!userId) {
    return res.status(403).send("User not authorized");
  } else {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).send("Card not found");
    }
    const index = card.likes.indexOf(userId);
    if (index === -1) {
      card.likes.push(userId);
    } else {
      card.likes.splice(index, 1);
    }
    await card.save();
    res.send("Card updated " + card.likes);
  }
});

app.delete("/api/card/:id", businessGuard, async (req, res) => {
  const { userId } = getLoggedUserId(req, res);

  if (!userId) {
    return res.status(403).send("User not authorized");
  } else {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).send("Card not found");
    }

    if (card.user_id.toString() !== userId) {
      return res.status(403).send("User not authorized to delete this card");
    }

    await Card.findByIdAndDelete(req.params.id);
    res.send("Card deleted successfully");
  }
});
};
