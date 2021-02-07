require("dotenv").config(); // imports the local env variables present in .env
const express = require("express");
const cors = require("cors"); // used for allowing access from different hosts, we cannot connect ot other hosts without cors
const app = express(); // call the express library
const morgan = require("morgan");

const signUpRoute = require("./routes/signUp/signUp.router");
const signInRoute = require("./routes/signIn/signIn.router");
const signUpStaffRoute = require("./routes/signUpStaff/signUp.router");
const signInStaffRoute = require("./routes/signInStaff/signIn.router");
const getDoctorsRoute = require("./routes/getDoctors/getDoctors.router");

//ADD MIDDLEWARES
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//ADD API ROUTES
app.use("/signUp", signUpRoute);
app.use("/signIn", signInRoute);
app.use("/signUpStaff", signUpStaffRoute);
app.use("/signInStaff", signInStaffRoute);
app.use("/getDoctors", getDoctorsRoute);
// app.use('/signInStaff');

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: "Welcome to the Hospital Management Application",
  });
});

// app.post("/users", userRouter);

//INITIALIZE SERVER
app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
