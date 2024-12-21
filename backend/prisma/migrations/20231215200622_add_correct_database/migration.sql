/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `AccessControl` (
    `AccessID` INTEGER NOT NULL,
    `FamilyTreeID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `AccessType` ENUM('view', 'edit') NOT NULL,

    INDEX `FamilyTreeID`(`FamilyTreeID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`AccessID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FamilyTree` (
    `FamilyTreeID` INTEGER NOT NULL AUTO_INCREMENT,
    `OwnerUserID` INTEGER NOT NULL,
    `Name` VARCHAR(255) NOT NULL,
    `Describtion` TEXT NOT NULL,
    `CreationDate` DATETIME(0) NOT NULL,
    `IsPublic` BOOLEAN NOT NULL,

    INDEX `OwnerUserID`(`OwnerUserID`),
    PRIMARY KEY (`FamilyTreeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `MessageID` INTEGER NOT NULL AUTO_INCREMENT,
    `MessageContent` TEXT NOT NULL,
    `SenderID` INTEGER NOT NULL,
    `ReceiverID` INTEGER NOT NULL,
    `Timestamp` DATETIME(0) NOT NULL,
    `isRead` BOOLEAN NOT NULL,

    INDEX `ReceiverID`(`ReceiverID`),
    INDEX `SenderID`(`SenderID`),
    PRIMARY KEY (`MessageID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Relationsships` (
    `RelationshipID` INTEGER NOT NULL AUTO_INCREMENT,
    `Relationship_type` ENUM('Vater', 'Mutter') NOT NULL,
    `StartDate` DATE NULL,
    `EndDate` DATE NULL,
    `PersonOneID` INTEGER NULL,
    `PersonTwoID` INTEGER NULL,

    INDEX `FK_RelaPerson`(`PersonOneID`),
    INDEX `FK_RelaPerson_2`(`PersonTwoID`),
    PRIMARY KEY (`RelationshipID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(255) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `ProfilePicture` BLOB NOT NULL,
    `CreationDate` DATETIME(0) NOT NULL,
    `LastLoginDate` DATETIME(0) NOT NULL,
    `IsActive` BOOLEAN NOT NULL,
    `ProfileVisibility` ENUM('view', 'edit') NOT NULL,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Persons` (
    `PersonID` INTEGER NOT NULL AUTO_INCREMENT,
    `Firstname` VARCHAR(30) NOT NULL,
    `Lastname` VARCHAR(30) NOT NULL,
    `Gender` ENUM('M', 'W', 'D') NOT NULL,
    `BirthDate` DATETIME(0) NOT NULL,
    `DateofDeath` DATETIME(0) NOT NULL,
    `ProfilePicture` BLOB NOT NULL,
    `FamilyTreeID` INTEGER NULL,

    INDEX `FamilyTreeID`(`FamilyTreeID`),
    PRIMARY KEY (`PersonID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccessControl` ADD CONSTRAINT `AccessControl_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Persons`(`PersonID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `AccessControl` ADD CONSTRAINT `AccessControl_ibfk_2` FOREIGN KEY (`FamilyTreeID`) REFERENCES `FamilyTree`(`FamilyTreeID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `AccessControl` ADD CONSTRAINT `AccessControl_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `FamilyTree` ADD CONSTRAINT `FamilyTree_ibfk_1` FOREIGN KEY (`OwnerUserID`) REFERENCES `Users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`MessageID`) REFERENCES `Users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`ReceiverID`) REFERENCES `Users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_ibfk_3` FOREIGN KEY (`SenderID`) REFERENCES `Users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Relationsships` ADD CONSTRAINT `FK_RelaPerson` FOREIGN KEY (`PersonOneID`) REFERENCES `Persons`(`PersonID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Relationsships` ADD CONSTRAINT `FK_RelaPerson_2` FOREIGN KEY (`PersonTwoID`) REFERENCES `Persons`(`PersonID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `Persons` ADD CONSTRAINT `Persons_ibfk_1` FOREIGN KEY (`FamilyTreeID`) REFERENCES `FamilyTree`(`FamilyTreeID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
