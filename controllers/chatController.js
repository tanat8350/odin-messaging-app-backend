const asyncHandler = require('express-async-handler');

const prisma = require('../configs/prisma');
const multer = require('../configs/multer');

const CustomError = require('../utils/customError');

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
    multer.single('image'),
    asyncHandler(async (req, res) => {
      const data = {
        senderid: +req.params.id,
        recipientid: +req.params.recipientid,
      };
      if (req.file) {
        data.message = req.file.filename;
        data.image = true;
      } else {
        data.message = req.body.message;
      }
      const message = await prisma.message.create({
        data: data,
      });
      if (!message) {
        throw new CustomError('fail to send a message', 500);
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

  postSendMessageGroupChat: asyncHandler(async (req, res) => {
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
