-- AlterTable
ALTER TABLE "exam_session" ADD COLUMN     "sc_earned" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "exam_session" ADD COLUMN     "sc_max" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "exam_session" ADD COLUMN     "mc_earned" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "exam_session" ADD COLUMN     "mc_max" INTEGER NOT NULL DEFAULT 0;
