const { generateToken } = require("./users.controller");
const router = require("express").Router();

router.post("/jwt", createUser);

module.exports = router;
