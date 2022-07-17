const express = require('express');
const cors = require('cors');
const { sync } = require('./routes');

const app = express();
const port = process.env.PORT || 3000;
const { API_TOKEN } = process.env;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('*', (req, res, next) => {
  const token = req.headers.authorization;

  if (token !== `Bearer ${API_TOKEN}`) {
    return res.status(401).send('Unauthorized!');
  }
  return next();
});

app.use('/sync', sync);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
