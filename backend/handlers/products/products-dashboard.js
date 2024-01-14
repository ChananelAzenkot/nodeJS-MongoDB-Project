const guard = require("../../guard");
const { Product } = require("./products.model");

async function getMethod(method) {
    const result = await Product.aggregate().group({ _id: null, value: { ['$' + method]: '$price' } });
    return result.pop().value.toString();
}

module.exports = app => {
    app.get("/dashboard/products/amount", guard, async (req, res) => {
        const amount = await Product.find().countDocuments();
        
        res.send(amount.toString());
    });
    
    app.get("/dashboard/products/avg", guard, async (req, res) => {
        res.send(await getMethod('avg'));
    });

    app.get("/dashboard/products/min", guard, async (req, res) => {
        res.send(await getMethod('min'));
    });

    app.get("/dashboard/products/max", guard, async (req, res) => {
        res.send(await getMethod('max'));
    });
}