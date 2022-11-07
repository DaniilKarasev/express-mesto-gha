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
    _id: '6367f8edc1dfb0d668dc21f7',
  };

  next();
});
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use('/*', (req, res) => { res.status(404).send({ message: 'Путь не найден' }); });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
