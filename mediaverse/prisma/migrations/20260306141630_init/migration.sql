/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'TV_SHOW', 'BOOK', 'GAME');

-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('PLAN_TO_CONSUME', 'IN_PROGRESS', 'COMPLETED', 'DROPPED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "releaseDate" TIMESTAMP(3),
    "coverImage" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaLog" (
    "id" TEXT NOT NULL,
    "rating" INTEGER,
    "review" TEXT,
    "status" "LogStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieDetails" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "director" TEXT,
    "runtime" INTEGER,

    CONSTRAINT "MovieDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TVDetails" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "creator" TEXT,
    "seasons" INTEGER,
    "episodes" INTEGER,

    CONSTRAINT "TVDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookDetails" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pageCount" INTEGER,
    "isbn" TEXT,

    CONSTRAINT "BookDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameDetails" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "developer" TEXT,
    "platforms" TEXT[],

    CONSTRAINT "GameDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaLog_userId_mediaId_key" ON "MediaLog"("userId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieDetails_mediaId_key" ON "MovieDetails"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "TVDetails_mediaId_key" ON "TVDetails"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "BookDetails_mediaId_key" ON "BookDetails"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "GameDetails_mediaId_key" ON "GameDetails"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "MediaLog" ADD CONSTRAINT "MediaLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaLog" ADD CONSTRAINT "MediaLog_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieDetails" ADD CONSTRAINT "MovieDetails_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TVDetails" ADD CONSTRAINT "TVDetails_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookDetails" ADD CONSTRAINT "BookDetails_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameDetails" ADD CONSTRAINT "GameDetails_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
