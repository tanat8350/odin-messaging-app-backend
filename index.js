const express = require('express');
const cors = require('cors');

const app = express();

const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 60000, // 1 min
  max: 30,
});
app.use(limiter);
const compression = require('compression');
app.use(compression());
const helmet = require('helmet');
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

const authenticationRouter = require('./routes/authentication');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/', authenticationRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.statusCode || 'error';
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
});

app.listen(3000, () => {});
