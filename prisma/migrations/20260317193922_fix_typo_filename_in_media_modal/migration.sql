/*
  Warnings:

  - You are about to drop the column `fildname` on the `media` table. All the data in the column will be lost.
  - Added the required column `filename` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" DROP COLUMN "fildname",
ADD COLUMN     "filename" TEXT NOT NULL;
