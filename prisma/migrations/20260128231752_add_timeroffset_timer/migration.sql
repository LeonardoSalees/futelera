-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "startTime" TIMESTAMP(3),
ADD COLUMN     "timerOffset" INTEGER NOT NULL DEFAULT 0;
