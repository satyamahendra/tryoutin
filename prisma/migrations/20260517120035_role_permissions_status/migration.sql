-- AlterTable
ALTER TABLE "permission" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "role" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
