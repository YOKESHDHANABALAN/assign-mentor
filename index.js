const express = require('express')
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const roomRoutes = require('./routes/student');
const mentorRoutes = require('./routes/mentor');


app.get('/', (req, res) => {
  res.json({'message':"Hello World!"})
})

mongoose.connect(config.MONGODB).then(
response => {
  console.log('MongoDB connected Logdb');
},
err => {
  console.log(err);
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(roomRoutes);
app.use(mentorRoutes);
app.listen(config.PORT, () => {
  console.log(`Example app listening on port ${config.PORT}`)
})