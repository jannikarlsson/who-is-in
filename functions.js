function convertRowToBoolean(rows) {
    return rows.map(row => ({
        ...row,
        office: row.office === 1,
        lunch: row.lunch === 1,
        swim: row.swim === 1,
        aw: row.aw === 1
      }));
};

module.exports = convertRowToBoolean;