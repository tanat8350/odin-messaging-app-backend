const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

const authenticationRouter = require('./routes/authentication');
const userRouter = require('./routes/user');
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/', authenticationRouter);
app.use('/user', userRouter);

app.listen(3000, () => {});
