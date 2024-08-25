const asyncHandler = require('express-async-handler');

const prisma = require('../configs/prisma');
const multer = require('../configs/multer');

const CustomError = require('../utils/customError');

module.exports = {
  getUsers: asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });
    res.json(users);
  }),

  getUser: asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: +req.params.id,
      },
      include: {
        friends: true,
        friendOf: true,
        groupChats: true,
      },
    });
    if (!user) {
      throw new CustomError('cannot find user', 404);
    }
    const { password, ...noPassword } = user;
    res.json(noPassword);
  }),

  getOthers: asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      where: {
        id: { not: +req.params.id },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
      },
    });
    res.json(users);
  }),

  putUpdateUser: asyncHandler(async (req, res) => {
    const updated = await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        displayName: req.body.displayName,
      },
    });
    if (!updated) {
      throw new CustomError('fail to update user', 500);
    }
    const { password, ...noPassword } = updated;
    res.json(noPassword);
  }),

  postAddFriend: asyncHandler(async (req, res) => {
    const updated = await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        friends: {
          connect: {
            id: +req.body.friendId,
          },
        },
      },
    });
    if (!updated) {
      throw new CustomError('fail to add friend', 500);
    }
    const { password, ...noPassword } = updated;
    res.json(noPassword);
  }),

  deleteRemoveFriend: asyncHandler(async (req, res) => {
    const updated = await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        friends: {
          disconnect: {
            id: +req.body.friendId,
          },
        },
      },
    });
    if (!updated) {
      throw new CustomError('fail to remove friend', 500);
    }
    res.json(updated);
  }),

  getUserMessage: asyncHandler(async (req, res) => {
    const messages = await prisma.message.findMany({
      orderBy: { timestamp: 'asc' },
      where: {
        senderid: +req.params.id,
        receiverid: +req.params.receiverid,
      },
      include: {
        senderid: false,
        receiverid: false,
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        receiver: {
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
        receiverid: +req.params.receiverid,
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
};
