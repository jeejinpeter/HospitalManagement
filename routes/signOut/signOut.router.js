const { userLogout } = require("./signOut.controller");
const router = require("express").Router();

router.post("/", userLogout);

module.exports = router;