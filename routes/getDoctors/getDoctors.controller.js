const { fetchDoctors } = require("./getDoctors.service");
const config = require("../../config/token");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const getDetails = async function (req, res) {
  console.log("Hit api /getDoctors");
  const body = req.body;
  const headers = req.headers;
  console.log("headers", headers);
  body.token = headers.authorization;

  // JOI validation for all user inputs
  const schemaHeader = Joi.object({
    token: Joi.string().required(),
  });

  const { error1 } = await schemaHeader.validate(headers); // check if validation returns an error
  if (error1) {
    return res.status(400).json({
      success: false,
      data: error,
    });
  }

  // JOI validation for all user inputs
  const schema = Joi.object({
    dept_id: Joi.number().required(),
    token: Joi.string().required(),
  });

  const { error } = await schema.validate(body); // check if validation returns an error
  if (error) {
    return res.status(400).json({
      success: false,
      data: error,
    });
  }
  let doctors, decoded;
  //validate token
  console.log("body token", body.token);
  try {
    decoded = jwt.verify(body.token, config.secret);
  } catch (err) {
    return res.status(401).json({
      success: false,
      data: "Invalid JWT token",
    });
  }
  console.log("decoded", decoded.id);
  // fetch doctor based on dept_id
  try {
    doctors = await fetchDoctors(body);
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: "Database error 1",
    });
  }

  if (!doctors[0]) {
    return res.status(401).json({
      success: false,
      data: "Doctor does not exist",
    });
  }
  console.log(doctors[0]);
  body.doctors = doctors[0];

  return res.status(200).json({
    success: true,
    data: "Fetch doctors successful",
    details: body.doctors,
  });
};

module.exports = {
  getDetails,
};
