/*
  Warnings:

  - Changed the type of `grammy` on the `Artist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "grammy",
ADD COLUMN     "grammy" INTEGER NOT NULL;
