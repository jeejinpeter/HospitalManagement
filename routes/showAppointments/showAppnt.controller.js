const config = require("../../config/token");
const jwt = require("jsonwebtoken");
const jwtKey = config.secret;
console.log(config);
const patientAppointments = async function (req, res) {
   let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjEyMTcwNzIyLCJleHAiOjE2MTIyNTcxMjJ9.l7sdLKwyco2blA0KsA0qor9EmxGSSbrr1vksvAEeFDA';    
   let payload
   try {
       payload = jwt.verify(token, config)
       console.log(payload);
   } catch (e) {

       if (e instanceof jwt.JsonWebTokenError) {
        payload = jwt.verify(token, jwtKey)
        console.log(payload);
           // if the error thrown is because the JWT is unauthorized, return a 401 error
           return res.status(401).end()    
       }
       // otherwise, return a bad request error
       return res.status(400).end()
   }
   console.log(payload);
   res.send(`Welcome ${payload.username}!`)
}


module.exports = {
 patientAppointments,
  };     