/*
  Warnings:

  - You are about to drop the column `nodePosition` on the `FamilyTree` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `FamilyTree` DROP COLUMN `nodePosition`,
    ADD COLUMN `NodePosition` TEXT NULL;
