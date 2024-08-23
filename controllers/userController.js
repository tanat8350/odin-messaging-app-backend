const asyncHandler = require('express-async-handler');

const prisma = require('../configs/prisma');

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

  getOthers: asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      where: {
        id: { not: +req.params.id },
      },
      select: {
        id: true,
        username: true,
      },
    });
    res.json(users);
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

  postSendMessage: asyncHandler(async (req, res) => {
    const message = await prisma.message.create({
      data: {
        message: req.body.message,
        senderid: +req.params.id,
        receiverid: +req.params.receiverid,
      },
    });
    if (!message) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'fail to send a message' }] });
    }
    res.json({ success: true });
  }),
};
