const guard = require("../../guards/guard");
const { Product } = require("./products.model");
const { getLoggedUserId } = require("../../config/config");

async function getMethod(method, req, res) {
  getLoggedUserId(req, res);
  const result = await Product.aggregate().group({
    _id: null,
    value: { ["$" + method]: "$price" },
  });
  return result.pop().value.toString();
}

module.exports = (app) => {
  app.get("/dashboard/products/amount", guard, async (req, res) => {
    const amount = await Product.find().countDocuments();

    res.send(amount.toString());
  });

  app.get("/dashboard/products/avg", guard, async (req, res) => {
    res.send(await getMethod("avg", req, res));
  });

  app.get("/dashboard/products/min", guard, async (req, res) => {
    res.send(await getMethod("min", req, res));
  });

  app.get("/dashboard/products/max", guard, async (req, res) => {
    res.send(await getMethod("max", req, res));
  });
};
