/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 80026 (8.0.26)
 Source Host           : localhost:3306
 Source Schema         : todo_matter

 Target Server Type    : MySQL
 Target Server Version : 80026 (8.0.26)
 File Encoding         : 65001

 Date: 04/07/2023 22:36:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for friend_req
-- ----------------------------
DROP TABLE IF EXISTS `friend_req`;
CREATE TABLE `friend_req`  (
  `from_uid` int NOT NULL COMMENT '申请来自哪个用户',
  `to_uid` int NOT NULL COMMENT '申请对象的用户id',
  `req_status` enum('agree','reject','pending') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'pending' COMMENT '申请状态\r\n1：agree(成功),2:reject(拒绝) 3:pending(等待) 默认 pending',
  `req_time` timestamp NOT NULL COMMENT '发送请求的时间 ',
  `agree_time` timestamp NULL DEFAULT NULL COMMENT '同意的时间',
  `vertify_txt` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '验证的消息。',
  `req_id` int NOT NULL AUTO_INCREMENT,
  `notes` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '如果同意，给添加的好友写备注',
  PRIMARY KEY (`req_id`) USING BTREE,
  INDEX `fk_friend_req1`(`from_uid` ASC) USING BTREE,
  INDEX `fk_friend_req2`(`to_uid` ASC) USING BTREE,
  CONSTRAINT `fk_friend_req1` FOREIGN KEY (`from_uid`) REFERENCES `user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_friend_req2` FOREIGN KEY (`to_uid`) REFERENCES `user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friend_req
-- ----------------------------
INSERT INTO `friend_req` VALUES (1, 2, 'agree', '2023-06-20 11:04:21', '2023-06-20 11:08:14', '我是刘厚裕', 2, 'ttg清清');
INSERT INTO `friend_req` VALUES (1, 3, 'reject', '2023-06-21 13:53:52', '2023-06-23 20:21:25', '我是刘厚裕', 6, 'ttg九尾');
INSERT INTO `friend_req` VALUES (1, 3, 'reject', '2023-06-23 20:23:51', '2023-06-23 20:24:12', '我是刘厚裕', 7, '九尾');
INSERT INTO `friend_req` VALUES (1, 3, 'agree', '2023-06-23 20:29:00', '2023-06-23 21:07:39', '我是刘厚裕,我想加你为好友', 8, 'ttg九尾');
INSERT INTO `friend_req` VALUES (4, 1, 'agree', '2023-06-23 23:27:04', '2023-06-23 23:27:19', '我是不然，我想加你为好友', 9, 'lhy');
INSERT INTO `friend_req` VALUES (6, 1, 'agree', '2023-06-30 18:11:52', '2023-06-30 20:15:30', '我是最后,我想加你为好友', 10, '刘厚裕');
INSERT INTO `friend_req` VALUES (1, 6, 'pending', '2023-06-30 20:15:07', NULL, '我是lhy,我想加你为好友', 11, '小姐姐');

-- ----------------------------
-- Table structure for friendship
-- ----------------------------
DROP TABLE IF EXISTS `friendship`;
CREATE TABLE `friendship`  (
  `uid1` int NOT NULL COMMENT '主视角',
  `uid2` int NOT NULL COMMENT 'uid2是以uid1为主视角所拥有的好友',
  `start_time` timestamp NOT NULL COMMENT '成为好友的时间',
  `notes1` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '以uid1为视角，给uid2的备注',
  `notes2` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '以uid2为视角，给uid1的备注'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friendship
-- ----------------------------
INSERT INTO `friendship` VALUES (1, 2, '2023-06-20 11:08:14', '同学-清清', NULL);
INSERT INTO `friendship` VALUES (1, 3, '2023-06-23 21:07:39', '同学-猫尾', NULL);
INSERT INTO `friendship` VALUES (4, 1, '2023-06-23 23:27:19', 'lhy', NULL);
INSERT INTO `friendship` VALUES (6, 1, '2023-06-30 20:15:30', '刘厚裕', NULL);

-- ----------------------------
-- Table structure for matter_summary
-- ----------------------------
DROP TABLE IF EXISTS `matter_summary`;
CREATE TABLE `matter_summary`  (
  `m_id` int NOT NULL COMMENT '事项id',
  `summary` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '总结',
  `score` int NOT NULL DEFAULT 0 COMMENT '自我评分，0-100',
  `time` timestamp NOT NULL COMMENT '时间',
  UNIQUE INDEX `idx_unique_m_summary_id`(`m_id` ASC) USING BTREE,
  CONSTRAINT `fk_matter_summary` FOREIGN KEY (`m_id`) REFERENCES `matters` (`m_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of matter_summary
-- ----------------------------
INSERT INTO `matter_summary` VALUES (1, '还不错！', 5, '2023-06-08 11:06:26');
INSERT INTO `matter_summary` VALUES (2, '在这个过程中深刻学习到在写html项目时，如何利用面向对象的思想，来写不同的方法', 5, '2023-06-26 17:44:03');
INSERT INTO `matter_summary` VALUES (3, '通过prop进行传递参数，且要考虑好可扩展性', 3, '2023-06-25 11:31:07');
INSERT INTO `matter_summary` VALUES (4, '表象良好', 5, '2023-06-30 18:33:41');
INSERT INTO `matter_summary` VALUES (5, '', 0, '2023-06-27 08:36:45');
INSERT INTO `matter_summary` VALUES (6, '今天很棒，再接再厉', 5, '2023-06-30 20:07:37');

-- ----------------------------
-- Table structure for matters
-- ----------------------------
DROP TABLE IF EXISTS `matters`;
CREATE TABLE `matters`  (
  `m_id` int NOT NULL AUTO_INCREMENT COMMENT '事项id',
  `title` varchar(22) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `details` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'null' COMMENT '详情',
  `m_status` enum('success','failed','afoot') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'afoot',
  `start_time` date NOT NULL COMMENT '开始日期',
  `u_id` int NOT NULL COMMENT '用户',
  `estimated_time` date NOT NULL COMMENT '预计完成时间',
  `actual_time` date NULL DEFAULT NULL COMMENT '实际完成时间',
  PRIMARY KEY (`m_id`) USING BTREE,
  INDEX `fk_matter_user`(`u_id` ASC) USING BTREE,
  CONSTRAINT `fk_matter_user` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of matters
-- ----------------------------
INSERT INTO `matters` VALUES (1, '学习webpack', '了解打包工具wbpack、学会相关配置、会自己写loader', 'failed', '2023-06-04', 1, '2023-02-28', NULL);
INSERT INTO `matters` VALUES (2, '多用ts面向对象方法', '多练习一些常用得类，比如播放器，信号灯等等', 'success', '2023-06-17', 1, '2023-07-03', '2023-06-18');
INSERT INTO `matters` VALUES (3, '组建好多要学的', '多了解一些vue的高阶知识', 'success', '2023-06-17', 1, '2023-06-30', '2023-06-18');
INSERT INTO `matters` VALUES (4, 'git', '学会用git基本操作', 'success', '2023-06-18', 1, '2023-06-22', '2023-04-25');
INSERT INTO `matters` VALUES (5, '查看sql语句', '看看待办事项有正在做变为成功时，总览会不会发生改变', 'success', '2023-06-24', 1, '2023-06-25', '2023-06-25');
INSERT INTO `matters` VALUES (6, '11', '12323', 'success', '2023-06-24', 1, '2023-06-30', '2023-06-25');
INSERT INTO `matters` VALUES (7, '12323', '12313123', 'success', '2023-06-24', 1, '2023-06-30', '2023-06-25');
INSERT INTO `matters` VALUES (8, '1232', '不不不不不吧', 'success', '2023-06-24', 1, '2023-07-01', '2023-06-25');
INSERT INTO `matters` VALUES (9, '明天搬家', '使用货拉拉进行搬家', 'failed', '2023-06-30', 2, '2023-07-01', NULL);
INSERT INTO `matters` VALUES (10, '旅游', '去北京看长城', 'success', '2023-06-30', 1, '2023-07-05', '2023-06-30');
INSERT INTO `matters` VALUES (11, '完成作业', '123', 'failed', '2023-06-30', 1, '2023-07-01', NULL);
INSERT INTO `matters` VALUES (12, '完成期末项目', '完成录制', 'success', '2023-06-30', 1, '2023-07-01', '2023-06-30');

-- ----------------------------
-- Table structure for message_log
-- ----------------------------
DROP TABLE IF EXISTS `message_log`;
CREATE TABLE `message_log`  (
  `msg_id` int NOT NULL AUTO_INCREMENT COMMENT '留言的id',
  `msg_content` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '留言的文字内容，限制100',
  `logs_id` int NOT NULL COMMENT '所属日志的id',
  `u_id` int NOT NULL COMMENT '这个留言的作者id',
  `reply_uid` int NULL DEFAULT NULL COMMENT '回复的用户id',
  PRIMARY KEY (`msg_id`) USING BTREE,
  INDEX `fk_logs_id`(`logs_id` ASC) USING BTREE,
  INDEX `fk_user_uid`(`u_id` ASC) USING BTREE,
  INDEX `fk_reply_user_uid`(`reply_uid` ASC) USING BTREE,
  CONSTRAINT `fk_logs_id` FOREIGN KEY (`logs_id`) REFERENCES `userlogs` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_reply_user_uid` FOREIGN KEY (`reply_uid`) REFERENCES `user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_uid` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of message_log
-- ----------------------------

-- ----------------------------
-- Table structure for overview_of_matters
-- ----------------------------
DROP TABLE IF EXISTS `overview_of_matters`;
CREATE TABLE `overview_of_matters`  (
  `u_id` int NOT NULL COMMENT '用户的id',
  `total` int NULL DEFAULT 0 COMMENT '事项总数',
  `doing` int NULL DEFAULT 0 COMMENT '正在做的总数',
  `failure` int NULL DEFAULT 0 COMMENT '失败的总数（没有在规定时间完成的）',
  `achieve` int NULL DEFAULT 0 COMMENT '成功的总数',
  INDEX `u_id`(`u_id` ASC) USING BTREE,
  CONSTRAINT `overview_of_matters_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of overview_of_matters
-- ----------------------------
INSERT INTO `overview_of_matters` VALUES (4, 0, 0, 0, 0);
INSERT INTO `overview_of_matters` VALUES (5, 0, 0, 0, 0);
INSERT INTO `overview_of_matters` VALUES (1, 11, 0, 1, 10);
INSERT INTO `overview_of_matters` VALUES (2, 1, 0, 1, 0);
INSERT INTO `overview_of_matters` VALUES (3, 0, 0, 0, 0);
INSERT INTO `overview_of_matters` VALUES (6, 0, 0, 0, 0);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `u_id` int NOT NULL AUTO_INCREMENT,
  `u_name` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `u_password` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pic_url` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '/avatar/default.png' COMMENT '个人头像，有设置默认值',
  `u_signature` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '个性签名',
  PRIMARY KEY (`u_id`) USING BTREE,
  UNIQUE INDEX `u_name`(`u_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'lhy', '1234qwer1', '/avatar/1_avatar_1688100698969.jpg', '123');
INSERT INTO `user` VALUES (2, '清清', '1234qwer', '/avatar/default.png', '(NULL)');
INSERT INTO `user` VALUES (3, '九尾', 'jw1234qwer', '/avatar/default.png', '(NULL)');
INSERT INTO `user` VALUES (4, '不然', '1234qwer', '/avatar/default.png', '(NULL)');
INSERT INTO `user` VALUES (5, '冰尘', '1234qwer', '/avatar/default.png', '(NULL)');
INSERT INTO `user` VALUES (6, '最后', '1234qwer', '/avatar/6_avatar_1688119432645.jpeg', NULL);

-- ----------------------------
-- Table structure for userlogs
-- ----------------------------
DROP TABLE IF EXISTS `userlogs`;
CREATE TABLE `userlogs`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '日志id',
  `u_id` int NOT NULL COMMENT '用户id',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '日志文本数据',
  `img_urls` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '存储的是图片路径，为一个数组',
  `time` timestamp NOT NULL COMMENT '发表日志时间',
  `sure` enum('true','false') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'true' COMMENT '表示是否启用，用来伪造删除的状态，（\'true\',\'false\'） 默认值为’true‘',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_userlogs`(`u_id` ASC) USING BTREE,
  CONSTRAINT `userlogs_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of userlogs
-- ----------------------------
INSERT INTO `userlogs` VALUES (1, 1, '第一次测试🤭🤔😏', '[]', '2023-06-29 13:30:35', 'false');
INSERT INTO `userlogs` VALUES (2, 1, '第二次测试😄，\r\n顺便添加图片', '[\"/logsImage/11688016688441_0.png\",\"/logsImage/11688016688443_1.png\"]', '2023-06-29 13:31:28', 'false');
INSERT INTO `userlogs` VALUES (3, 1, '很开心发表第一次日志😄', '[\"/logsImage/11688017004528_0.jpeg\"]', '2023-06-29 13:36:44', 'true');
INSERT INTO `userlogs` VALUES (4, 1, '测试空格换行\r\n测试空格换行\r\n测试空格换行', '[]', '2023-06-29 16:10:43', 'false');
INSERT INTO `userlogs` VALUES (5, 1, '查看换行符\r\n111', '[]', '2023-06-29 16:11:55', 'false');
INSERT INTO `userlogs` VALUES (6, 1, '测试空格问题\r\n       查看', '[]', '2023-06-29 16:12:42', 'false');
INSERT INTO `userlogs` VALUES (8, 1, '试试看暴露的方法', '[\"/logsImage/11688043487222_0.jpg\"]', '2023-06-29 20:58:07', 'false');
INSERT INTO `userlogs` VALUES (9, 1, '12323', '[\"/logsImage/11688043571476_0.jpg\"]', '2023-06-29 20:59:31', 'false');
INSERT INTO `userlogs` VALUES (10, 1, '🤗🤫🤤', '[]', '2023-06-29 22:38:47', 'true');
INSERT INTO `userlogs` VALUES (11, 1, '今天好开心🤔😐😏', '[\"/logsImage/11688127378753_0.png\",\"/logsImage/11688127378756_1.png\",\"/logsImage/11688127378759_2.png\"]', '2023-06-30 20:16:18', 'true');

-- ----------------------------
-- Procedure structure for update_status
-- ----------------------------
DROP PROCEDURE IF EXISTS `update_status`;
delimiter ;;
CREATE PROCEDURE `update_status`()
BEGIN
  UPDATE matters
  SET m_status = 'failed'
  WHERE m_status = 'afoot' AND STR_TO_DATE(estimated_time, '%Y-%m-%d') <= CURDATE();
END
;;
delimiter ;

-- ----------------------------
-- Event structure for event_update_status
-- ----------------------------
DROP EVENT IF EXISTS `event_update_status`;
delimiter ;;
CREATE EVENT `event_update_status`
ON SCHEDULE
EVERY '1' DAY STARTS '2023-06-11 00:00:00'
DO CALL update_status()
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table friend_req
-- ----------------------------
DROP TRIGGER IF EXISTS `tg_friendship`;
delimiter ;;
CREATE TRIGGER `tg_friendship` AFTER UPDATE ON `friend_req` FOR EACH ROW BEGIN
	IF NEW.req_status = 'agree' THEN
		INSERT INTO friendship (uid1, uid2, start_time,notes1) VALUES (NEW.from_uid, NEW.to_uid, NEW.agree_time,NEW.notes);
	END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table matters
-- ----------------------------
DROP TRIGGER IF EXISTS `tr_add_total_matter`;
delimiter ;;
CREATE TRIGGER `tr_add_total_matter` AFTER INSERT ON `matters` FOR EACH ROW BEGIN
	UPDATE overview_of_matters SET total = total +1 ,doing = doing +1 WHERE u_id = NEW.u_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table matters
-- ----------------------------
DROP TRIGGER IF EXISTS `tr_update_total_matter`;
delimiter ;;
CREATE TRIGGER `tr_update_total_matter` AFTER UPDATE ON `matters` FOR EACH ROW BEGIN
    DECLARE new_status ENUM ( 'success', 'failed', 'afoot' );
    SET new_status = NEW.m_status;
    IF EXISTS(SELECT 1 FROM overview_of_matters WHERE u_id=NEW.u_id) THEN
			IF new_status = 2 THEN
					UPDATE overview_of_matters SET failure = failure + 1, doing = doing - 1  WHERE u_id=NEW.u_id ;
			ELSEIF new_status = 1 THEN
					UPDATE overview_of_matters SET achieve = achieve + 1, doing = doing - 1  WHERE u_id=NEW.u_id;
			END IF;
		END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table user
-- ----------------------------
DROP TRIGGER IF EXISTS `init_overview_of_matters`;
delimiter ;;
CREATE TRIGGER `init_overview_of_matters` AFTER INSERT ON `user` FOR EACH ROW BEGIN
	INSERT INTO overview_of_matters (u_id) VALUES (NEW.u_id);
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
