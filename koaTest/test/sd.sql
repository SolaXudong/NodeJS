/*
Navicat MySQL Data Transfer

Source Server         : （测试MySQL）121.43.177.106
Source Server Version : 50634
Source Host           : 121.43.177.106:3306
Source Database       : test_wechat_biz_db

Target Server Type    : MYSQL
Target Server Version : 50634
File Encoding         : 65001

Date: 2018-03-22 10:21:40
*/
SET
  FOREIGN_KEY_CHECKS = 0;
-- ----------------------------
  -- Table structure for habits
  -- ----------------------------
  DROP TABLE IF EXISTS `habits`;
CREATE TABLE `habits` (
    `id` int(11) NOT NULL,
    `u_id` int(11) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- ----------------------------
  -- Records of habits
  -- ----------------------------
INSERT INTO `habits`
VALUES
  ('1001', '1', '爱好一');
INSERT INTO `habits`
VALUES
  ('1002', '1', '爱好二');
INSERT INTO `habits`
VALUES
  ('1003', '1', '爱好三');
INSERT INTO `habits`
VALUES
  ('1004', '2', '爱好四');
INSERT INTO `habits`
VALUES
  ('1005', '2', '爱好五');
INSERT INTO `habits`
VALUES
  ('1006', '3', '爱好六');
INSERT INTO `habits`
VALUES
  ('1007', '4', '爱好七');
-- ----------------------------
  -- Table structure for streak
  -- ----------------------------
  DROP TABLE IF EXISTS `streak`;
CREATE TABLE `streak` (
    `id` int(11) NOT NULL,
    `h_id` int(11) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `length` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- ----------------------------
  -- Records of streak
  -- ----------------------------
INSERT INTO `streak`
VALUES
  ('10001', '1001', '特征一', '70');
INSERT INTO `streak`
VALUES
  ('10002', '1002', '特征二', '60');
INSERT INTO `streak`
VALUES
  ('10003', '1003', '特征三', '90');
INSERT INTO `streak`
VALUES
  ('10004', '1004', '特征四', '50');
INSERT INTO `streak`
VALUES
  ('10005', '1005', '特征五', '88');
INSERT INTO `streak`
VALUES
  ('10006', '1006', '特征六', '66');
INSERT INTO `streak`
VALUES
  ('10007', '1007', '特征七', '77');
-- ----------------------------
  -- Table structure for users
  -- ----------------------------
  DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` int(11) NOT NULL,
    `name` varchar(255) DEFAULT NULL,
    `phone` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- ----------------------------
  -- Records of users
  -- ----------------------------
INSERT INTO `users`
VALUES
  ('1', '小明', '120');
INSERT INTO `users`
VALUES
  ('2', '小红', '121');
INSERT INTO `users`
VALUES
  ('3', '小绿', '122');
INSERT INTO `users`
VALUES
  ('4', '小黑', '123');