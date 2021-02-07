const { checkEmail, saveToken } = require("./signIn.service");
const config = require("../../config/token");
const Joi = require("joi");
const { compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = async function (data) {
  return jwt.sign({ id: data }, config.secret, { expiresIn: 86400 }); // valid for 24 hrs
};

const userLogin = async function (req, res) {
  console.log("Hit api /signInStaff");
  const body = req.body;

  // JOI validation for all user inputs
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = await schema.validate(body); // check if validation returns an error
  if (error) {
    return res.status(400).json({
      success: false,
      data: error,
    });
  }
  let selectUser, passwordValidation, token, insertJWT;
  try {
    selectUser = await checkEmail(body);
  } catch {
    return res.status(500).json({
      success: false,
      data: "Database error 1",
    });
  }

  if (!selectUser[0]) {
    return res.status(401).json({
      success: false,
      data: "User does not exist",
    });
  }

  console.log(selectUser[0]);
  body.user_id = selectUser[0].user_id;
  //decrypt the password and compare
  passwordValidation = compareSync(body.password, selectUser[0].password);
  if (!passwordValidation) {
    return res.status(401).json({
      success: false,
      data: "Invalid email or password",
    });
  }
  // generate auth token

  token = await generateToken(selectUser[0].user_id);
  console.log("TOKEN", token);
  body.token = token;
  try {
    insertJWT = await saveToken(body);
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: err,
    });
  }

  if (!insertJWT) {
    return res.status(500).json({
      success: false,
      data: "insert into jwt failed",
    });
  }
  return res.status(200).json({
    success: true,
    token: token,
    data: "Sign In successful",
    details: insertJWT,
  });
};

module.exports = {
  userLogin,
};
