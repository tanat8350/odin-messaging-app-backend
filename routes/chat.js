const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');

const chatController = require('../controllers/chatController');

// group chat
router.post('/group', verifyToken, chatController.postCreateGroupChat);
router.get('/group/:id', verifyToken, chatController.getGetGroupChat);
router.delete('/group/:id', verifyToken, chatController.deleteDeleteGroupChat);
router.post(
  '/group/:id/message',
  verifyToken,
  chatController.postSendMessageGroupChat
);
router.put('/group/:id/user', verifyToken, chatController.putAddUserGroupChat);
router.delete(
  '/group/:id/user',
  verifyToken,
  chatController.deleteRemoveUserGroupChat
);

router.get('/:id/:recipientid', verifyToken, chatController.getUserMessage);
router.post('/:id/:recipientid', verifyToken, chatController.postSendMessage);
router.post(
  '/:id/:recipientid/image',
  verifyToken,
  chatController.postSendMessageImage
);

module.exports = router;
