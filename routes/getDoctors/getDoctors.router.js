const { getDetails } = require("./getDoctors.controller");
const router = require("express").Router();

router.post("/", getDetails);

module.exports = router;
