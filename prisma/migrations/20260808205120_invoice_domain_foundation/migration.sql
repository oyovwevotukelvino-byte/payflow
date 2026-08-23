/*
  Warnings:

  - Added the required column `customerName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_invoiceId_key";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "nextInvoiceNumber" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "customerAddress" TEXT,
ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");
