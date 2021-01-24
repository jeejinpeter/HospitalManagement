const { userLogin } = require("./signIn.controller");
const router = require("express").Router();

router.post("/", userLogin);

module.exports = router;
