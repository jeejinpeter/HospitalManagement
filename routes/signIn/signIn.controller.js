const { checkEmail, saveToken } = require("./signIn.service");
const config = require("../../config/token");
const Joi = require("joi");
const { compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = async function (data) {
  return jwt.sign({ id: data }, config.secret, { expiresIn: 86400 }); // valid for 24 hrs
};

const userLogin = async function (req, res) {
  console.log("Hit api /signUp");
  const body = req.body;

  // JOI validation for all user inputs
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = await schema.validate(body); // check if validation returns an error
  if (error) {
    return res.status(400).json({
      success: 0,
      data: error,
    });
  } else {
    let selectUser, passwordValidation, token, insertJWT;
    try {
      selectUser = await checkEmail(body);
    } catch {
      return res.status(500).json({
        success: 0,
        data: "Database error 1",
      });
    }

    if (selectUser[0]) {
      console.log(selectUser[0]);
      body.user_id = selectUser[0].user_id;
      //decrypt the password and compare
      passwordValidation = compareSync(body.password, selectUser[0].password);
      if (passwordValidation) {
        // generate auth token

        token = await generateToken(selectUser[0].user_id);
        console.log("TOKEN", token);
        body.token = token;
        try {
          insertJWT = await saveToken(body);
          console.log("insertJWT", insertJWT);
        } catch (err) {
          return res.status(500).json({
            success: 0,
            data: err,
          });
        }

        console.log("insertJWT", insertJWT);
        if (insertJWT) {
          return res.status(200).json({
            success: 1,
            token: token,
            data: insertJWT,
          });
        } else {
          return res.status(500).json({
            success: 0,
            data: "insert into jwt failed",
          });
        }
      } else {
        return res.status(401).json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    } else {
      return res.status(401).json({
        success: 0,
        data: "User does not exist",
      });
    }
  }
};

module.exports = {
  userLogin,
};
