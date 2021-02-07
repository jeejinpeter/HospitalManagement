const { genSaltSync, hashSync } = require("bcrypt");
const Joi = require("joi");
const {
  checkPhone,
  checkEmail,
  insertIntoUser,
  getDeptID,
} = require("./signUp.service");

const createUser = async function (req, res) {
  console.log("Hit api /signUp");
  const body = req.body;

  const salt = genSaltSync(10);
  body.password = hashSync(body.password, salt);
  console.log("body", body);

  // JOI validation for all user inputs
  const schema = Joi.object({
    user_name: Joi.string()
      .regex(/^[a-zA-Z ]*$/) // checks that it contains only alphabets and spaces
      .min(3)
      .max(50)
      .required(),
    date_of_birth: Joi.date().iso().required(),
    gender: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    dept_id: Joi.number().required(),
    experience: Joi.number().required(),
    specialization: Joi.string().required(),
  });

  const { error } = await schema.validate(body); // check if validation returns an error
  if (error) {
    return res.status(400).json({
      success: false,
      data: error,
    });
  }
  //calculate age from DOB
  function getAge(dateString) {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  let age;
  age = getAge(body.date_of_birth); //pass date as yyyy-mm-dd string
  body.age = age;

  //set date of registration
  let epochCurrentTime = Date.now();
  let date_of_registration = new Date(epochCurrentTime); //sets date to epoch
  body.date_of_registration = date_of_registration;

  //check if phone exists
  let phoneRows, emailRows, insertRows, department;
  try {
    phoneRows = await checkPhone(body);
  } catch {
    return res.status(500).json({
      success: false,
      data: "Database error 1",
    });
  }

  if (phoneRows[0]) {
    return res.status(400).json({
      success: false,
      data: "User phone number already exists",
      user_id: phoneRows[0].user_id,
    });
  }
  try {
    emailRows = await checkEmail(body);
  } catch {
    return res.status(500).json({
      success: false,
      data: "Database error 2",
    });
  }
  if (emailRows[0]) {
    return res.status(400).json({
      success: false,
      data: "User email already exists",
      user_id: emailRows[0].user_id,
    });
  }
  //get department id
  try {
    department = await getDeptID(body);
  } catch {
    return res.status(500).json({
      success: false,
      data: "Database error , couldnt get department ID",
    });
  }
  console.log("dept", department);

  if (!department[0]) {
    return res.status(400).json({
      success: false,
      data: "Department ID doesnt exist",
    });
  }

  body.dept_name = department[0].dept_name;
  //insert into user table
  try {
    insertRows = await insertIntoUser(body);
    console.log("insertRows", insertRows);
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: err,
    });
  }
  if (!insertRows) {
    return res.status(500).json({
      success: false,
      data: "Insert into user, auth and doctor table failed",
    });
  } else {
    return res.status(200).json({
      success: true,
      data: "Insert new staff user successful",
    });
  }
};

module.exports = {
  createUser,
};
