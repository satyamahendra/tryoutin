/*
  Warnings:

  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "price",
ADD COLUMN     "price_actual" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "price_alternate" INTEGER NOT NULL DEFAULT 0;
