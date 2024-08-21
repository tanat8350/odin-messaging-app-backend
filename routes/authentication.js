const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authentication');

router.post('/signup', authenticationController.postSignup);
router.post('/login', authenticationController.postLogin);

module.exports = router;
