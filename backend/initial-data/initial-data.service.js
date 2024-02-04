const { User } = require("../handlers/users/models/user.model");
const { Card } = require("../handlers/cards/cards.model");
const { users, cards } = require("./initial-data.json");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
// upload the initial data to the database //
const initialDataStart = async () => {
  const userAmount = await User.find().countDocuments();

  if (!userAmount) {
    const userIds = [];

    for (const u of users) {
      u.password = await bcrypt.hash(u.password, 10);
      const user = new User(u);
      const obj = await user.save();
      
      if (obj.IsBusiness) {
        userIds.push(obj._id);
      }
    }
    console.log(chalk.bgYellowBright("the users in the initial data uploaded !"));

    for (const c of cards) {
      const card = new Card(c);
      const i = Math.floor(Math.random() * userIds.length);
      card.user_id = userIds[i];
      await card.save();
    }
    console.log(chalk.bgYellowBright("the cards in the initial data uploaded !"));
  }
};

initialDataStart();
