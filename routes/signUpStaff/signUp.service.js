const pool = require("../../config/database");
const promisePool = pool.promise();

const checkPhone = async function (data) {
  const [
    rows,
    fields,
  ] = await promisePool.query(`select user_id from user where phone in (?)`, [
    data.phone,
  ]);
  return rows;
};

const checkEmail = async function (data) {
  const [
    rows,
    fields,
  ] = await promisePool.query(`select user_id from user where email in (?)`, [
    data.email,
  ]);
  return rows;
};

const getDeptID = async function (data) {
  const [
    rows,
    fields,
  ] = await promisePool.query(
    `select dept_name from department where dept_id = (?)`,
    [data.dept_id]
  );
  return rows;
};

const insertIntoUser = async function (data) {
  const conn = await promisePool.getConnection();
  if (!conn) {
    return new Error("Couldnt establish connection");
  }
  const transaction = await promisePool.query("START TRANSACTION");
  if (!transaction) {
    return new Error("Couldnt start transaction");
  }
  const inserted = await promisePool.query(
    `insert into user(user_name, date_of_birth, age, gender, date_of_registration, phone, address, email) values(?,?,?,?,?,?,?,?)`,
    [
      data.user_name,
      data.date_of_birth,
      data.age,
      data.gender,
      data.date_of_registration,
      data.phone,
      data.address,
      data.email,
    ]
  );
  if (!inserted) {
    promisePool.query("ROLLBACK");
    return new Error("Insert into user table failed");
  }
  const user_id = await promisePool.query(
    `select user_id from user where email in (?)`,
    [data.email]
  );
  if (!user_id) {
    promisePool.query("ROLLBACK");
    return new Error("Select user_id failed");
  }
  console.log("INSERTING TO user table");
  console.log("user_id", user_id[0][0].user_id);
  const results = await promisePool.query(
    `insert into auth(user_id, email, password, role) values(?,?,?,?)`,
    [user_id[0][0].user_id, data.email, data.password, 2]
  );
  if (!results) {
    promisePool.query("ROLLBACK");
    return new Error("Insert into auth table failed");
  }
  const insertDoctor = await promisePool.query(
    `insert into doctor() values(?,?,?,?)`,
    [user_id[0][0].user_id, data.specialization, data.experience, data.dept_id]
  );
  if (!insertDoctor) {
    promisePool.query("ROLLBACK");
    return new Error("Insert into doctor table failed");
  }

  promisePool.query("COMMIT");
  console.log("results", results);
  return {
    success: true,
    data: results,
  };
};

module.exports = {
  checkPhone,
  checkEmail,
  getDeptID,
  insertIntoUser,
};
