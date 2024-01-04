module.exports = app => {
    app.get("/users/logout", (req, res) => {
        res.clearCookie("jwt");
        res.send("Logged out");
    });
}
