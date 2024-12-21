-- AlterTable
ALTER TABLE `Messages` MODIFY `isRead` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `Persons` MODIFY `DateofDeath` DATETIME(0) NULL,
    MODIFY `ProfilePicture` BLOB NULL;

-- AlterTable
ALTER TABLE `Users` MODIFY `ProfilePicture` BLOB NULL,
    MODIFY `LastLoginDate` DATETIME(0) NULL,
    MODIFY `IsActive` BOOLEAN NULL;
