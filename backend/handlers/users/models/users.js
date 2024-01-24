const { adminGuard } = require("../../../guards");
const { guard } = require("../../../guards");
const { businessGuard } = require("../../../guards");
const { User } = require("./user.model");
const jwt = require("../../../config/config");

module.exports = (app) => {
  
      app.get('/api/users', adminGuard, async (req, res) => {
     const users = await User.find();
     res.send(users);
      });
    
      app.get("/api/users/:id", adminGuard || guard , async (req, res) => {
        const user = await User.findById(req.params.id);

        if (!user) {
          return res.status(404).send("User not found");
        }

        res.send(user);
      });
    
      app.put('/api/users/:id', adminGuard || guard, async (req, res) => {
        const { getTokenParams } = jwt(req.headers.authorization,process.env.JWT_SECRET);
        const { userId } = getTokenParams(req, res);
        req.body.userId = userId;
        if (!req.body.userId)
          return res.status(403).send("User not authorized");
      });

          app.patch("/api/users/:id", businessGuard , async (req, res) => {
            const { userId } = getTokenParams(req, res);

            if (userId !== req.params.id) {
              return res.status(401).send("User not authorized");
            }

            const user = await User.findById(req.params.id);
            user.isBusiness = !user.isBusiness;
            await user.save();

            res.end();
          });

          app.delete("/api/users/:id", adminGuard, async (req, res) => {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
              return res.status(404).send("User not found");
            }

            res.send(user);
          });
}