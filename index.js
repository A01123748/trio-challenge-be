const express = require('express');
const { sync } = require('./routes');
var cors = require('cors')

const app = express();
const port = 3000;
// const corsOptions ={
//   origin:'http://localhost:3001', 
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }
app.use(cors()) // Use this after the variable declaration

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/sync', sync);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});