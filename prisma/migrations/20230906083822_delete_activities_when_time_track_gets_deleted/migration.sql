-- DropForeignKey
ALTER TABLE "TimeTrackActivity" DROP CONSTRAINT "TimeTrackActivity_timeTrackId_fkey";

-- AddForeignKey
ALTER TABLE "TimeTrackActivity" ADD CONSTRAINT "TimeTrackActivity_timeTrackId_fkey" FOREIGN KEY ("timeTrackId") REFERENCES "TimeTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
