/*
  Warnings:

  - You are about to drop the column `collaborationToken` on the `Documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "collaborationToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "collaborationToken" TEXT;
