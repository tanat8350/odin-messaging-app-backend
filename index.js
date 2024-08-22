const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authenticationRouter = require('./routes/authentication');
const userRouter = require('./routes/user');
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/', authenticationRouter);
app.use('/user', userRouter);

app.listen(3000, () => {});
