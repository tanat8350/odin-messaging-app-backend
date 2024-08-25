-- CreateTable
CREATE TABLE "groupChat" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "groupChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupChatMessage" (
    "id" SERIAL NOT NULL,
    "groupid" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,

    CONSTRAINT "groupChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserTogroupChat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserTogroupChat_AB_unique" ON "_UserTogroupChat"("A", "B");

-- CreateIndex
CREATE INDEX "_UserTogroupChat_B_index" ON "_UserTogroupChat"("B");

-- AddForeignKey
ALTER TABLE "groupChatMessage" ADD CONSTRAINT "groupChatMessage_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "groupChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserTogroupChat" ADD CONSTRAINT "_UserTogroupChat_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserTogroupChat" ADD CONSTRAINT "_UserTogroupChat_B_fkey" FOREIGN KEY ("B") REFERENCES "groupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
