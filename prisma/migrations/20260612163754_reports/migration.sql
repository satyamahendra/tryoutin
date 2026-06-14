-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('open', 'in_review', 'waiting_user', 'waiting_admin', 'resolved', 'rejected');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('bug', 'billing', 'content', 'account', 'other');

-- CreateTable
CREATE TABLE "report" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "ReportType" NOT NULL DEFAULT 'other',
    "status" "ReportStatus" NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order_id" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_message" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_user_id_idx" ON "report"("user_id");

-- CreateIndex
CREATE INDEX "report_status_idx" ON "report"("status");

-- CreateIndex
CREATE INDEX "report_message_report_id_idx" ON "report_message"("report_id");

-- CreateIndex
CREATE INDEX "report_message_sender_id_idx" ON "report_message"("sender_id");

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_message" ADD CONSTRAINT "report_message_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_message" ADD CONSTRAINT "report_message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
