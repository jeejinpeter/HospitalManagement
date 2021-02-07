const { patientAppointments } = require("./showAppnt.controller");
const router = require("express").Router();

router.post("/", patientAppointments);

module.exports = router;
