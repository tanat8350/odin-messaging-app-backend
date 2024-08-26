const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

// group chat
router.post('/group', chatController.postCreateGroupChat);
router.get('/group/:id', chatController.getGetGroupChat);
router.delete('/group/:id', chatController.deleteDeleteGroupChat);
router.post('/group/:id/message', chatController.postSendMessageGroupChat);
router.put('/group/:id/user', chatController.putAddUserGroupChat);
router.delete('/group/:id/user', chatController.deleteRemoveUserGroupChat);

router.get('/:id/:recipientid', chatController.getUserMessage);
router.post('/:id/:recipientid', chatController.postSendMessage);

module.exports = router;
