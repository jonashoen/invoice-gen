-- CreateTable
CREATE TABLE "TimeTrack" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "TimeTrack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeTrack" ADD CONSTRAINT "TimeTrack_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
