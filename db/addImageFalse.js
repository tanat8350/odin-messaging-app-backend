const prisma = require('../configs/prisma');

const addImageFalse = async () => {
  await prisma.message.updateMany({
    where: {
      image: undefined,
    },
    data: {
      image: false,
    },
  });
};

addImageFalse().then(() => prisma.$disconnect());
