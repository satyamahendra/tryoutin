-- AlterTable
ALTER TABLE "exam_session" ADD COLUMN     "scaled_max" DOUBLE PRECISION;
ALTER TABLE "exam_session" ADD COLUMN     "mc_score" DOUBLE PRECISION;

-- Note: 'essay' enum value is left in the database type intentionally.
-- PostgreSQL does not support dropping enum values; it is unused (no rows),
-- so it is harmless. The Prisma schema no longer exposes it.
