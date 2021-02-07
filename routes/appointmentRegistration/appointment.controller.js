const Joi = require("joi");
const { insertIntoAppointment } = require("./appointment.service");

const addAppointment = async function (req, res) {
    console.log("api / appointment");
    const body = req.body;

    console.log("body", body);

    // JOI validation for all inputs
  const schema = Joi.object({
    userToken: Joi.string().required(),
    dept_id: Joi.string().required(),
    appointment_date: Joi.date().iso().required(),
    doctor_id: Joi.string().required(),
    time_slot: Joi.string().required(),
  });

  const { error } = await schema.validate(body); // check if validation returns an error
  if (error) { console.log("here", error);
    return res.status(400).json({
      success: 0,
      data: error,
    });
  } else {
      let insertAppointment;
      try {
        insertAppointment = await insertIntoAppointment(body);
        console.log("insertRows", insertAppointment);
      } catch (err) {
        return res.status(500).json({
          success: 0,
          data: err,
        });
      }
      if (!insertAppointment) {
        return res.status(500).json({
          success: 0,
          data: "Insert into appointment table failed",
        });
      } else {
        return res.status(200).json({
          success: 1,
          data: "Inserted successfully",
        });
      }
  }


};


module.exports = {
    addAppointment,
  };