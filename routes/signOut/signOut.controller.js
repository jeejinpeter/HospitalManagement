const { checkToken } = require("./signOut.service");

const userLogout = async function (req, res) {
  console.log("signOut Api");
  const body = req.body;

  let checkAndDeleteToken;
  try{
    checkAndDeleteToken = await checkToken(body);
  } catch {
        return res.status(500).json({
        success: 0,
        data: "Database error occured",
      });
  }
  console.log(body);
    if (checkAndDeleteToken) {
        return res.status(200).json({
          success: 1,
          data: "Logged out Successfully",
        });
      } else {
        return res.status(500).json({
          success: 0,
          data: "Something went wrong..",
        });
      }
}
    


module.exports = {
    userLogout
  };