const express = require('express');
const cors = require('cors');
const { sync, helloWorld, security } = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', helloWorld);

app.use('*', security);

app.use('/sync', sync);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
