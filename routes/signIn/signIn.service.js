const pool = require("../../config/database");
const promisePool = pool.promise();

const checkEmail = async function (data) {
  const [
    rows,
    fields,
  ] = await promisePool.query(`select * from auth where email = ?`, [
    data.email,
  ]);
  return rows;
};

const saveToken = async function (data) {
  const conn = await promisePool.getConnection();
  if (!conn) {
    return new Error("Couldnt establish connection");
  }
  const transaction = await promisePool.query("START TRANSACTION");
  if (!transaction) {
    return new Error("Couldnt start transaction");
  }
  const existingJWT = await promisePool.query(
    `select user_id from jwt where user_id = ?`,
    [data.user_id]
  );
  console.log("EXISTING", existingJWT);
  if (existingJWT) {
    const deleted = await promisePool.query(
      `delete from jwt where user_id = ?`,
      [data.user_id]
    );
  }

  const results = await promisePool.query(
    `insert into jwt(user_id, jwt_token) values(?,?)`,
    [data.user_id, data.token]
  );
  if (!results) {
    promisePool.query("ROLLBACK");
    return new Error("Insert into jwt table failed");
  } else {
    promisePool.query("COMMIT");
    return results;
  }
};

module.exports = {
  checkEmail,
  saveToken,
};
