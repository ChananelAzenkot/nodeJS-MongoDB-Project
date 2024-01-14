const connectENV = process.env.NODE_ENV;

const connectToMongo = () => {
  if (connectENV === "development")
    require("./mongodb/connectToMongodbLocally");
  if (connectENV === "production") require("./mongodb/connectToAtlas");
};

module.exports = connectToMongo;
connectingServer