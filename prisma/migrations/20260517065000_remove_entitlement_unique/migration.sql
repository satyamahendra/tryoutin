-- DropIndex
DROP INDEX "entitlement_user_id_product_id_key";

-- CreateIndex
CREATE INDEX "entitlement_order_id_idx" ON "entitlement"("order_id");

-- CreateIndex
CREATE INDEX "entitlement_user_id_product_id_idx" ON "entitlement"("user_id", "product_id");
