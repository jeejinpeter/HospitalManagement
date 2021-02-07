const pool = require("../../config/database");
const promisePool = pool.promise();

const insertIntoAppointment = async function (data) {
    const conn = await promisePool.getConnection();
    if (!conn) {
      return new Error("Couldnt establish connection");
    }
    const transaction = await promisePool.query("START TRANSACTION");
    if (!transaction) {
      return new Error("Couldnt start transaction");
    }
    const user_id = await promisePool.query(
      `select user_id from jwt where jwt_token = ?`,
      [data.userToken]
    );
    if (!user_id) {
      promisePool.query("ROLLBACK");
      return new Error("Select user_id failed");
    } else {
      console.log("user_id", user_id[0][0].user_id);
      const results = await promisePool.query(
        `insert into appointment(patient_user_id, doctor_user_id, dept_id, date_of_appointment, time_slot, apptmt_status) values(?,?,?,?,?,?)`,
        [user_id[0][0].user_id, data.doctor_id, data.dept_id, data.appointment_date, data.time_slot, 1]
      );
      if (!results) {
        promisePool.query("ROLLBACK");
        return new Error("Insert into table failed");
      } else {
        promisePool.query("COMMIT");
        console.log("results", results);
        return {
          success: 1,
          data: results,
        };
      }
      
    }
};

module.exports = {
    insertIntoAppointment,
  };
  