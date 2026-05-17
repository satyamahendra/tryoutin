/*
  Warnings:

  - You are about to drop the column `midtransOrderId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[midtrans_order_id]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `midtrans_order_id` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_userId_fkey";

-- DropIndex
DROP INDEX "order_midtransOrderId_key";

-- DropIndex
DROP INDEX "order_userId_idx";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "midtransOrderId",
DROP COLUMN "userId",
ADD COLUMN     "midtrans_order_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "order_midtrans_order_id_key" ON "order"("midtrans_order_id");

-- CreateIndex
CREATE INDEX "order_user_id_idx" ON "order"("user_id");

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
