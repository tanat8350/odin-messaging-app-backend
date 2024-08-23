/*
  Warnings:

  - The `image` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "image",
ADD COLUMN     "image" BOOLEAN NOT NULL DEFAULT false;
