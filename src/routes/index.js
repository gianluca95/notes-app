const router = require("express").Router(); // Facilita la creación de rutas

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/about", (req, res) => {
    res.render("about")
})

module.exports = router;