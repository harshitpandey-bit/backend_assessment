const router = require("express").Router();
const helperController = require("../controllers/helperController");

router.get("/books", helperController.getAllBooks);

router.get("/users", helperController.getAllUsers);

module.exports = router;
