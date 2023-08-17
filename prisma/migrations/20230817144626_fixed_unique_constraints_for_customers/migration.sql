/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number,userId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Customer_name_key";

-- DropIndex
DROP INDEX "Customer_number_key";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_name_userId_key" ON "Customer"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_number_userId_key" ON "Customer"("number", "userId");
