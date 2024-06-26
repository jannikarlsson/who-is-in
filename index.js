const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());
app.use(express.json());

const usersRoute = require('./routes/users');
const logRoute = require('./routes/log');

app.use('/api/users', usersRoute);
app.use('/api/log', logRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});