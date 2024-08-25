const asyncHandler = require('express-async-handler');

const prisma = require('../configs/prisma');
const multer = require('../configs/multer');

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
      },
    });
    if (!user) {
      return res.status(500).json({ error: 'cannot find user' });
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
      return res.status(500).json({ error: 'Failed to update user' });
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
      return res.status(500).json({ error: 'Failed to add friend' });
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
      return res.status(500).json({ error: 'Failed to remove friend' });
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
        return res
          .status(400)
          .json({ errors: [{ msg: 'fail to send a message' }] });
      }
      res.json({ success: true });
    }),
  ],
};
