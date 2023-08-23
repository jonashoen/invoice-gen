/*
  Warnings:

  - You are about to drop the column `token` on the `UserPasswordReset` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `UserVerify` table. All the data in the column will be lost.
  - Added the required column `code` to the `UserPasswordReset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `UserVerify` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPasswordReset" DROP COLUMN "token",
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserVerify" DROP COLUMN "token",
ADD COLUMN     "code" TEXT NOT NULL;
