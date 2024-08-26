/*
  Warnings:

  - Added the required column `senderid` to the `groupChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groupChatMessage" ADD COLUMN     "senderid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "groupChatMessage" ADD CONSTRAINT "groupChatMessage_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
