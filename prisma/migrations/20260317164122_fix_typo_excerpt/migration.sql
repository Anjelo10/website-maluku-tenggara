/*
  Warnings:

  - You are about to drop the column `excertp` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "excertp",
ADD COLUMN     "excerpt" TEXT;
