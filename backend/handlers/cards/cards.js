const { guard, adminGuard } = require("../../guards");
const { businessGuard } = require("../../guards");
const { Card } = require("../cards/cards.model");
const { getLoggedUserId } = require("../../config/config");
const Joi = require("joi");
const {middlewareCards} = require("../../middleware/middlewareCards");

module.exports = (app) => {
  // get all cards users //
app.get("/api/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
  // get all cards of the logged user //
  app.get("/api/my-cards", guard, async (req, res) => {
    try {
      const { userId } = getLoggedUserId(req, res);

      if (!userId) {
        return res.status(403).json({ message: "User not authorized" });
      }
      const cards = await Card.find({ user_id: userId });

      if (!cards || cards.length === 0) {
        return res
          .status(404)
          .json({ message: "No cards found for this user" });
      }
      res.send(cards);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  // get a specific card by id //
app.get("/api/card/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.send(card);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Invalid Card ID" });
    }
    res.status(500).json({message: "Server error", error: error.message });
  }
});
  // add a new card and Posted //
app.post("/api/addCard", businessGuard, async (req, res) => {
  const { userId } = getLoggedUserId(req, res);

  if (!userId) {
    return res.status(403).json({ message: "User not authorized" });
  }

  req.body.user_id = userId;

  const { error } = middlewareCards.validate(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }

  const bizNumber = await Card.generateUniqueBizNumber();
  req.body.bizNumber = bizNumber;

  const card = new Card(req.body);

  try {
    const newCard = await card.save();
    res.send(newCard);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// update a card by id number //
app.put("/api/card/:id", businessGuard, async (req, res) => {
  const { userId , isAdmin } = getLoggedUserId(req, res);
  if (!userId) {
    return res.status(403).json({ message: "User not authorized" });
  }

  req.body.userId = userId;
  const { error } = middlewareCards.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.user_id.toString() !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this card" });
    }
    res.send("Card updated successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// update a card bizNumber by id number //
app.put("/api/bizNumber/:id", adminGuard, async (req, res) => {
  const newBizNumber = req.body.bizNumber;

  try {
    const card = await Card.findOne({ bizNumber: newBizNumber });
    if (card) {
      return res.status(400).json({ message: 'BizNumber is already in use' });
    }

    if (newBizNumber < 100000000 || newBizNumber > 999999999) {
      return res.status(400).json({ message: 'BizNumber must be a 9 digit number' });
    }

    const updatedCard = await Card.findByIdAndUpdate(req.params.id, { bizNumber: newBizNumber }, { new: true });
    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.send("BizNumber updated successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// like a card by id number //
app.patch("/api/cardLike/:id", guard, async (req, res) => {
  const { userId } = getLoggedUserId(req, res);
  if (!userId) {
    return res.status(403).json({ message: "User not authorized" });
  } else {
    try {
      const card = await Card.findById(req.params.id);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      const index = card.likes.indexOf(userId);
      if (index === -1) {
        card.likes.push(userId);
      } else {
        card.likes.splice(index, 1);
      }
      await card.save();
      res.send("Card updated " + card.likes);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});
// delete a card by id number //
app.delete("/api/card/:id", businessGuard, async (req, res) => {
  try {
    const { userId, isAdmin } = getLoggedUserId(req, res);

    if (!userId) {
      return res.status(403).json({ message: "User not authorized" });
    } else {
      const card = await Card.findById(req.params.id);

      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      if (card.user_id.toString() !== userId && !isAdmin) {
        return res
          .status(403)
          .json({ message: "User not authorized to delete this card" });
      }

      await Card.findByIdAndDelete(req.params.id);
      res.send("Card deleted successfully");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error", error: error.message});
  }
});
};
