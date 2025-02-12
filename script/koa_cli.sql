SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    -- `id`BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())), 
    `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    `userName` VARCHAR(30) NOT NULL,
    `password` VARCHAR(64) NOT NULL COMMENT '密码（加密存储）',
    `createAt` timestamp(0) NOT NULL DEFAULT  CURRENT_TIMESTAMP(0) COMMENT '使用函数形式表示只需要秒级精度而不需要毫秒级精度 CURRENT_TIMESTAMP 是函数 需要DEFAULT默认值',
    `updateAt` timestamp(0) NOT NULL DEFAULT  CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP ,
    `gender` int  DEFAULT 0 COMMENT '性别（0: 未知; 1: 男; 2: 女）',
    `birthday` DATE DEFAULT NULL,
    `email` VARCHAR(30)  DEFAULT NULL,
    `avatarURL` VARCHAR(250) DEFAULT NULL COMMENT '在应用层将默认的进行转化为空字符串或者其他',
    UNIQUE KEY `userName`(`userName`)
    INDEX `createAt_idx` (`createAt`) COMMENT '新增索引 有了索引就不会扫描整个表而是扫描索引 加快速度'
) ENGINE = InnoDB DEFAULT CHARSET= utf8mb4 COLLATE =  utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;