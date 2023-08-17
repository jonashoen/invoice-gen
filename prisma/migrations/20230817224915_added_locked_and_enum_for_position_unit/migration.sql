/*
  Warnings:

  - Changed the type of `unit` on the `InvoicePosition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InvoicePositionUnit" AS ENUM ('hours');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InvoicePosition" DROP COLUMN "unit",
ADD COLUMN     "unit" "InvoicePositionUnit" NOT NULL;
