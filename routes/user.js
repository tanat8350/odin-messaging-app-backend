const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getOthers);
router.put('/:id', userController.putUpdateUser);
router.get('/:id/:receiverid', userController.getUserMessage);
router.post('/:id/:receiverid', userController.postSendMessage);

module.exports = router;
