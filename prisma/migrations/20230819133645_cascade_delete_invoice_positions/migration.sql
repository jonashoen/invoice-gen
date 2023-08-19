-- DropForeignKey
ALTER TABLE "InvoicePosition" DROP CONSTRAINT "InvoicePosition_invoiceId_fkey";

-- AddForeignKey
ALTER TABLE "InvoicePosition" ADD CONSTRAINT "InvoicePosition_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
