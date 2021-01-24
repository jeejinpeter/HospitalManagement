const { createUser } = require("./signUp.controller");
const router = require("express").Router();

router.post("/", createUser);

module.exports = router;
