const { body, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const passport = require('../configs/passport');
const prisma = require('../configs/prisma');
require('dotenv').config();

const validateUser = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Username is required'),
  body('password')
    // to change later to 8
    .isLength({ min: 1 })
    // to is strong password
    .withMessage('Password is required'),
];

exports.postSignup = [
  validateUser,
  body('username').custom(async (value) => {
    const user = await prisma.user.findUnique({ where: { username: value } });
    if (user) {
      throw new Error('Username already exists');
    }
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    bcryptjs.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      const created = await prisma.user.create({
        data: {
          username: req.body.username,
          password: hash,
          displayName: req.body.username,
        },
      });
      if (!created) {
        return res.status(500).json({ error: 'Failed to create user' });
      }
      res.sendStatus(200);
    });
  },
];

exports.postLogin = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    } else {
      passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
          return res.status(500).json({ error: [{ msg: err }] });
        }
        if (!user) {
          return res.status(400).json({ error: [{ msg: info.message }] });
        }
        if (user) {
          jwt.sign({ id: user._id }, process.env.JWT_SECRET, (err, token) => {
            if (err) {
              next(err);
            }
            return res.json({ token, user });
          });
        }
      })(req, res, next);
    }
  },
];
