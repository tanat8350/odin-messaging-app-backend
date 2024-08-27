const asyncHandler = require('express-async-handler');

const prisma = require('../configs/prisma');
const multer = require('../configs/multer');

const CustomError = require('../utils/customError');
const { body, validationResult } = require('express-validator');

const validateMessage = [
  body('message')
    .isLength({ min: 1 })
    .withMessage('Message is required')
    .escape(),
];

const validateImage = [
  body('image')
    .custom((value, { req }) =>
      ['image/jpeg', 'image/jpg', 'image/png'].includes(req.file.mimetype)
    )
    .withMessage('Only jpeg, jpg and png are allowed'),
];

module.exports = {
  getUserMessage: asyncHandler(async (req, res) => {
    const messages = await prisma.message.findMany({
      orderBy: { timestamp: 'asc' },
      where: {
        senderid: +req.params.id,
        recipientid: +req.params.recipientid,
      },
      include: {
        senderid: false,
        recipientid: false,
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    res.json(messages);
  }),

  postSendMessage: [
    validateMessage,
    asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() });
      }
      const message = await prisma.message.create({
        data: {
          senderid: +req.params.id,
          recipientid: +req.params.recipientid,
          message: req.body.message,
        },
      });
      if (!message) {
        throw new CustomError('fail to send a message', 500);
      }
      res.json({ success: true });
    }),
  ],

  postSendMessageImage: [
    multer.single('image'),
    validateImage,
    asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() });
      }
      const message = await prisma.message.create({
        data: {
          senderid: +req.params.id,
          recipientid: +req.params.recipientid,
          message: req.file.filename,
          image: true,
        },
      });
      if (!message) {
        throw new CustomError('fail to send an image', 500);
      }
      res.json({ success: true });
    }),
  ],

  // to note
  // getGroupChat: asyncHandler(async (req, res) => {
  //   const groups = await prisma.groupChat.findMany({
  //     where: {
  //       users: {
  //         some: {
  //           id: +req.params.id,
  //         },
  //       },
  //     },
  //   });
  //   res.json(groups);
  // }),

  postCreateGroupChat: asyncHandler(async (req, res) => {
    const group = await prisma.groupChat.create({
      data: {
        users: {
          connect: {
            id: +req.body.id,
          },
        },
      },
    });
    if (!group) {
      throw new CustomError('fail to create a group chat', 500);
    }
    res.json({ ...group, success: true });
  }),

  getGetGroupChat: asyncHandler(async (req, res, next) => {
    const group = await prisma.groupChat.findUnique({
      where: {
        id: +req.params.id,
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });
    if (!group) {
      throw new CustomError('cannot find group chat', 404);
    }
    res.json(group);
  }),

  deleteDeleteGroupChat: asyncHandler(async (req, res, next) => {
    const deleted = await prisma.groupChat.delete({
      where: {
        id: +req.params.id,
      },
    });
    if (!deleted) {
      throw new CustomError('fail to delete a group chat', 500);
    }
    res.json({ success: true });
  }),

  postSendMessageGroupChat: [
    validateMessage,
    asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() });
      }
      const message = await prisma.groupChatMessage.create({
        data: {
          groupid: +req.params.id,
          senderid: +req.body.senderid,
          message: req.body.message,
        },
      });
      if (!message) {
        throw new CustomError('fail to send a message', 500);
      }
      res.json({ success: true });
    }),
  ],

  putAddUserGroupChat: asyncHandler(async (req, res, next) => {
    const updated = await prisma.groupChat.update({
      where: {
        id: +req.params.id,
      },
      data: {
        users: {
          connect: {
            id: +req.body.userid,
          },
        },
      },
    });
    if (!updated) {
      throw new CustomError('fail to add user to group chat', 500);
    }
    res.json({ success: true });
  }),

  deleteRemoveUserGroupChat: asyncHandler(async (req, res, next) => {
    const updated = await prisma.groupChat.update({
      where: {
        id: +req.params.id,
      },
      data: {
        users: {
          disconnect: {
            id: +req.body.userid,
          },
        },
      },
    });
    if (!updated) {
      throw new CustomError('fail to remove user to group chat', 500);
    }
    res.json({ success: true });
  }),
};
