/*
  Warnings:

  - You are about to drop the column `receiverid` on the `Message` table. All the data in the column will be lost.
  - Added the required column `recipientid` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverid_fkey";

-- DropForeignKey
ALTER TABLE "groupChatMessage" DROP CONSTRAINT "groupChatMessage_groupid_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "receiverid",
ADD COLUMN     "recipientid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientid_fkey" FOREIGN KEY ("recipientid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupChatMessage" ADD CONSTRAINT "groupChatMessage_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "groupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
