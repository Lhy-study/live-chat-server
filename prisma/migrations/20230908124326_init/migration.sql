-- CreateTable
CREATE TABLE `User` (
    `uid` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(16) NOT NULL,
    `password` VARCHAR(16) NOT NULL,
    `gender` ENUM('female', 'male', 'unknown') NOT NULL DEFAULT 'unknown',
    `avatar` VARCHAR(255) NULL DEFAULT '/avatar/default.png',
    `signature` VARCHAR(30) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FriendShip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id1` INTEGER NOT NULL,
    `id2` INTEGER NOT NULL,
    `time` TIMESTAMP NOT NULL,
    `isdelete` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FriendReq` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `form_uid` INTEGER NOT NULL,
    `target_uid` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `agree_time` DATETIME(3) NULL,
    `is_agree` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conversation` (
    `convid` INTEGER NOT NULL AUTO_INCREMENT,
    `isgroup` BOOLEAN NOT NULL DEFAULT false,
    `createtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endtime` DATETIME(3) NULL,

    PRIMARY KEY (`convid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Particpant` (
    `ptcid` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `convid` INTEGER NOT NULL,

    PRIMARY KEY (`ptcid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatInfo` (
    `chatinfoid` INTEGER NOT NULL AUTO_INCREMENT,
    `senderid` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `contentType` ENUM('TEXT', 'IMG') NOT NULL,
    `sendtime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`chatinfoid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FriendShip` ADD CONSTRAINT `fk_id1` FOREIGN KEY (`id1`) REFERENCES `User`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `FriendShip` ADD CONSTRAINT `fk_id2` FOREIGN KEY (`id2`) REFERENCES `User`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `FriendReq` ADD CONSTRAINT `fk_from` FOREIGN KEY (`form_uid`) REFERENCES `User`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `FriendReq` ADD CONSTRAINT `fk_target` FOREIGN KEY (`target_uid`) REFERENCES `User`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;
