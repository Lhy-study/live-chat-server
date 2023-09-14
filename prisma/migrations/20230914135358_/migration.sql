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
    `time` DATETIME(3) NOT NULL,
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
    `conv_id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_group` BOOLEAN NOT NULL DEFAULT false,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_chat_id` INTEGER NULL,

    UNIQUE INDEX `Conversation_conv_id_key`(`conv_id`),
    UNIQUE INDEX `Conversation_end_chat_id_key`(`end_chat_id`),
    PRIMARY KEY (`conv_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatInfo` (
    `chatinfo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `contentType` ENUM('TEXT', 'IMG', 'VEDIO', 'OTHERFILE', 'VOICE') NOT NULL DEFAULT 'TEXT',
    `send_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `convid` INTEGER NOT NULL,

    UNIQUE INDEX `ChatInfo_convid_key`(`convid`),
    PRIMARY KEY (`chatinfo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CircleOfFriends` (
    `cirfri_id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `otherId` INTEGER NULL,
    `time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`cirfri_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtherFiles` (
    `other_id` INTEGER NOT NULL AUTO_INCREMENT,
    `otherType` ENUM('IMG', 'VEDIO', 'OTHERFILE') NULL,
    `otherValue` VARCHAR(191) NULL,
    `CFId` INTEGER NOT NULL,

    UNIQUE INDEX `OtherFiles_CFId_key`(`CFId`),
    PRIMARY KEY (`other_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CFMessage` (
    `other_id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `CFId` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`other_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LikeCF` (
    `userId` INTEGER NOT NULL,
    `CFId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `CFId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ConversationToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ConversationToUser_AB_unique`(`A`, `B`),
    INDEX `_ConversationToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FriendShip` ADD CONSTRAINT `fk_id1` FOREIGN KEY (`id1`) REFERENCES `User`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `FriendShip` ADD CONSTRAINT `fk_id2` FOREIGN KEY (`id2`) REFERENCES `User`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `FriendReq` ADD CONSTRAINT `fk_from` FOREIGN KEY (`form_uid`) REFERENCES `User`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `FriendReq` ADD CONSTRAINT `fk_target` FOREIGN KEY (`target_uid`) REFERENCES `User`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ChatInfo` ADD CONSTRAINT `ChatInfo_con` FOREIGN KEY (`convid`) REFERENCES `Conversation`(`conv_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatInfo` ADD CONSTRAINT `ChatInfo_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CircleOfFriends` ADD CONSTRAINT `CircleOfFriends_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OtherFiles` ADD CONSTRAINT `OtherFiles_CFId_fkey` FOREIGN KEY (`CFId`) REFERENCES `CircleOfFriends`(`cirfri_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CFMessage` ADD CONSTRAINT `CFMessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CFMessage` ADD CONSTRAINT `CFMessage_CFId_fkey` FOREIGN KEY (`CFId`) REFERENCES `CircleOfFriends`(`cirfri_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConversationToUser` ADD CONSTRAINT `_ConversationToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Conversation`(`conv_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConversationToUser` ADD CONSTRAINT `_ConversationToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
