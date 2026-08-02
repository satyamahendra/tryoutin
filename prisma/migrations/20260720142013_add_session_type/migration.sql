-- CreateEnum
CREATE TYPE "ExamSessionType" AS ENUM ('simulation', 'practice');

-- AlterTable
ALTER TABLE "exam_session" ADD COLUMN     "type" "ExamSessionType" NOT NULL DEFAULT 'simulation';
