const pool = require("../../config/database");
const promisePool = pool.promise();



const checkToken = async function (data) {
  const conn = await promisePool.getConnection();
  if (!conn) {
    return new Error("Couldnt establish connection");
  }
  const transaction = await promisePool.query("START TRANSACTION");
  if (!transaction) {
    return new Error("Couldnt start transaction");
  }
  const existingToken = await promisePool.query(
    `select user_id from jwt where jwt_token = ?`,
    [data.token]
  );

  if(existingToken){
    const deleteToken = await promisePool.query(
      `delete from jwt where user_id = ?`,
      [data.user_id]
  );

    if (!deleteToken) {
      promisePool.query("ROLLBACK");
      return new Error("Token delete in jwt table failed");
    } else {
      promisePool.query("COMMIT");
      return deleteToken;
    }
    
  }
    return true;
    };

module.exports = {
    checkToken,
  };