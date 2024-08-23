const prisma = require('../configs/prisma');

const update = async () => {
  const noDisplayName = await prisma.user.findMany({
    where: {
      displayName: null,
    },
  });
  noDisplayName.forEach((item) => {
    prisma.user.update({
      where: {
        id: item.id,
      },
      data: {
        displayName: item.username,
      },
    });
  });
};

update().then(() => prisma.$disconnect());
