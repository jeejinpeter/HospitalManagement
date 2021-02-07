const { addAppointment } = require("./appointment.controller");
const router = require("express").Router();

router.post("/", addAppointment);

module.exports = router;