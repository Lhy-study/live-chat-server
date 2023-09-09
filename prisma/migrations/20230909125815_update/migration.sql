/*
  Warnings:

  - The primary key for the `chatinfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chatinfoid` on the `chatinfo` table. All the data in the column will be lost.
  - You are about to drop the column `senderid` on the `chatinfo` table. All the data in the column will be lost.
  - You are about to drop the column `sendtime` on the `chatinfo` table. All the data in the column will be lost.
  - The primary key for the `conversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `convid` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `createtime` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `endtime` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `isgroup` on the `conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[convid]` on the table `ChatInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[end_chat_id]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatinfo_id` to the `ChatInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convid` to the `ChatInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `ChatInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conv_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_conversationtouser` DROP FOREIGN KEY `_ConversationToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `chatinfo` DROP FOREIGN KEY `ChatInfo_senderid_fkey`;

-- AlterTable
ALTER TABLE `chatinfo` DROP PRIMARY KEY,
    DROP COLUMN `chatinfoid`,
    DROP COLUMN `senderid`,
    DROP COLUMN `sendtime`,
    ADD COLUMN `chatinfo_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `convid` INTEGER NOT NULL,
    ADD COLUMN `send_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `sender_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`chatinfo_id`);

-- AlterTable
ALTER TABLE `conversation` DROP PRIMARY KEY,
    DROP COLUMN `convid`,
    DROP COLUMN `createtime`,
    DROP COLUMN `endtime`,
    DROP COLUMN `isgroup`,
    ADD COLUMN `conv_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `end_chat_id` INTEGER NULL,
    ADD COLUMN `is_group` BOOLEAN NOT NULL DEFAULT false,
    ADD PRIMARY KEY (`conv_id`);

-- CreateIndex
CREATE UNIQUE INDEX `ChatInfo_convid_key` ON `ChatInfo`(`convid`);

-- CreateIndex
CREATE UNIQUE INDEX `Conversation_end_chat_id_key` ON `Conversation`(`end_chat_id`);

-- AddForeignKey
ALTER TABLE `ChatInfo` ADD CONSTRAINT `ChatInfo_con_end` FOREIGN KEY (`convid`) REFERENCES `Conversation`(`conv_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatInfo` ADD CONSTRAINT `ChatInfo_con` FOREIGN KEY (`convid`) REFERENCES `Conversation`(`conv_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatInfo` ADD CONSTRAINT `ChatInfo_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `User`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConversationToUser` ADD CONSTRAINT `_ConversationToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Conversation`(`conv_id`) ON DELETE CASCADE ON UPDATE CASCADE;
