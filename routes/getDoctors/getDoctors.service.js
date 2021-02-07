const pool = require("../../config/database");
const promisePool = pool.promise();

const fetchDoctors = async function (data) {
  const [
    rows,
    fields,
  ] = await promisePool.query(`select * from doctor where dept_id = (?)`, [
    data.dept_id,
  ]);
  return rows;
};

module.exports = {
  fetchDoctors,
};
