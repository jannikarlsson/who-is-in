function convertRowToBoolean(rows) {
    return rows.map(row => ({
        ...row,
        office: row.office === 1,
        lunch: row.lunch === 1,
        swim: row.swim === 1,
        aw: row.aw === 1
      }));
};

function convertSingleFromRowToBoolean(row) {
    return {
        ...row,
        office: row.office === 1,
        lunch: row.lunch === 1,
        swim: row.swim === 1,
        aw: row.aw === 1
      };
};

function convertBooleanToRow(row) {
    return {
      ...row,
      office: row.office ? 1 : 0,
      lunch: row.lunch ? 1 : 0,
      swim: row.swim ? 1 : 0,
      aw: row.aw ? 1 : 0
    };
  }

module.exports = {convertRowToBoolean, convertBooleanToRow, convertSingleFromRowToBoolean};