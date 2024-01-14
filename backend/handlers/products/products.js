const guard = require("../../guard");
const { Product } = require("./products.model");
const { ProductValid } = require("./products.joi");

module.exports = (app) => {
  app.get("/products", guard, async (req, res) => {
    res.send(await Product.find());
  });

  app.get("/product_like", guard, async (req, res) => {
    res.send(await Product.find({ unLike: true }));
  });

  app.get("/products/:id", guard, async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      return res.status(403).send("Product not found");
    }

    res.send(product);
  });

  app.post("/products", guard, async (req, res) => {
    const { name, price, discount } = req.body;

    const validate = ProductValid.validate(req.body, { abortEarly: false });

    if (validate.error) {
      const errors = validate.error.details.map((err) => err.message);
      return res.status(403).send(errors);
    }

    const product = new Product({ name, price, discount });
    const obj = await product.save();

    res.send(obj);
  });

  app.put("/products/:id", guard, async (req, res) => {
    const { name, price, discount } = req.body;

    if (!name || !price || !discount) {
      return res.status(403).send("required parameters missing");
    }

    const obj = await Product.findByIdAndUpdate(req.params.id, {
      name,
      price,
      discount,
    });

    if (!obj) {
      return res.status(403).send("Product not found");
    }

    res.send();
  });

  app.patch("/product_like/:id", guard, async (req, res) => {
    const userId = getLoggedUserId(req, res);

    if (userId !== req.params.id) {
      return res.status(401).send("User not authorized to do likes");
    }

    const user = await User.findById(req.params.id);

    user.unLike = !user.unLike;

    await user.save();

    res.end();
  });

  app.delete("/products/:id", guard, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
    } catch (err) {
      return res.status(403).send("Product not found");
    }

    res.send();
  });
};
