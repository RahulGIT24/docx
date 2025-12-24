/*
  Warnings:

  - You are about to drop the column `sharingUrl` on the `Documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "sharingUrl",
ADD COLUMN     "collaborationToken" TEXT,
ADD COLUMN     "editAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharingToken" TEXT;
