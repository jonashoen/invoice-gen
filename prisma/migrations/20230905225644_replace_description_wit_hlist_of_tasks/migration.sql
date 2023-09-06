/*
  Warnings:

  - You are about to drop the column `description` on the `TimeTrack` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TimeTrack" DROP COLUMN "description";

-- CreateTable
CREATE TABLE "TimeTrackActivity" (
    "id" SERIAL NOT NULL,
    "timeTrackId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TimeTrackActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeTrackActivity" ADD CONSTRAINT "TimeTrackActivity_timeTrackId_fkey" FOREIGN KEY ("timeTrackId") REFERENCES "TimeTrack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
