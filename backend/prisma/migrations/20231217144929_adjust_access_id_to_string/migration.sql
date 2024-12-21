/*
  Warnings:

  - The primary key for the `AccessControl` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `AccessControl` DROP PRIMARY KEY,
    MODIFY `AccessID` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`AccessID`);
