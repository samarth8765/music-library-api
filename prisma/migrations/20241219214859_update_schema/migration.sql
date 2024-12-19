/*
  Warnings:

  - You are about to drop the column `created_at` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "albumAlbum_id" TEXT,
ADD COLUMN     "artistArtist_id" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "trackTrack_id" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_artistArtist_id_fkey" FOREIGN KEY ("artistArtist_id") REFERENCES "Artist"("artist_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_albumAlbum_id_fkey" FOREIGN KEY ("albumAlbum_id") REFERENCES "Album"("album_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_trackTrack_id_fkey" FOREIGN KEY ("trackTrack_id") REFERENCES "Track"("track_id") ON DELETE SET NULL ON UPDATE CASCADE;
