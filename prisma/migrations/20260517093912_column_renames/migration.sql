-- Rename columns instead of drop/recreate (preserves all data)

-- entitlement
ALTER TABLE "entitlement" RENAME COLUMN "createdAt" TO "created_at";

-- order
ALTER TABLE "order" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "order" RENAME COLUMN "grossAmount" TO "gross_amount";
ALTER TABLE "order" RENAME COLUMN "paidAt" TO "paid_at";
ALTER TABLE "order" RENAME COLUMN "updatedAt" TO "updated_at";

-- Add new columns that genuinely didn't exist before
ALTER TABLE "order" ADD COLUMN "midtrans_redirect" TEXT;
ALTER TABLE "order" ADD COLUMN "midtrans_token" TEXT;

-- product
ALTER TABLE "product" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "product" RENAME COLUMN "updatedAt" TO "updated_at";