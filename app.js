/* eslint-disable no-console */
const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6368da2c10c1061daf2a68f7',
  };

  next();
});
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use('/*', (req, res, next) => { next(res.status(404).send('Путь не найден')); });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
