const express = require('express');
const router = express.Router();

const { getAllLogs, getLogForWeek, createLog, updateRow } = require('../managers/logManager.js')

router.get('/', (req, res) => {
  return getAllLogs(req, res);
});

router.get('/:year/:week', (req, res) => {
  return getLogForWeek(req, res);
});

router.post('/', (req, res) => {
  return createLog(req, res);
});

router.patch('/:id', (req, res) => {
  return updateRow(req, res);
});

module.exports = router;
