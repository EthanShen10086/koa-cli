SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    -- `id`BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())), 
    -- `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    `id` VARCHAR(20) NOT NULL,
    `userName` VARCHAR(30) NOT NULL,
    `password` VARCHAR(64) NOT NULL COMMENT '密码（加密存储）',
    `createAt` timestamp(0) NOT NULL DEFAULT  CURRENT_TIMESTAMP(0) COMMENT '使用函数形式表示只需要秒级精度而不需要毫秒级精度 CURRENT_TIMESTAMP 是函数 需要DEFAULT默认值',
    `updateAt` timestamp(0) NOT NULL DEFAULT  CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP ,
    `gender` int  DEFAULT 0 COMMENT '性别（0: 未知; 1: 男; 2: 女）',
    `birthday` DATE DEFAULT NULL,
    `email` VARCHAR(30)  DEFAULT NULL,
    `avatarURL` VARCHAR(250) DEFAULT NULL COMMENT '在应用层将默认的进行转化为空字符串或者其他',
    PRIMARY KEY (`id`) COMMENT '这样写是表级字段约束 直接把关键词放在字段后面是字段级约束 考虑是否跨表',
    UNIQUE KEY `userName`(`userName`),
    INDEX `createAt_idx` (`createAt`) COMMENT '新增索引 有了索引就不会扫描整个表而是扫描索引 加快速度'
) ENGINE = InnoDB DEFAULT CHARSET= utf8mb4 COLLATE =  utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `upload`;          
CREATE TABLE `upload`(
	`id` VARCHAR(20) NOT NULL,
	`filename` VARCHAR(100) NOT NULL ,
    `fileURL` VARCHAR(255) NOT NULL,
	`mimetype` VARCHAR(30) DEFAULT NULL ,
	`size` int DEFAULT NULL ,
	`userId` VARCHAR(20) NOT NULL,
	`createAt` timestamp(0) NULL  DEFAULT  CURRENT_TIMESTAMP(0),
	`momentId` VARCHAR(20) DEFAULT  NULL ,
	 PRIMARY KEY (`id`),
	 UNIQUE KEY `filename`(`filename`),
	 KEY `userId`(`userId`),
	 KEY `momentId`(`momentId`),
	 CONSTRAINT  FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	 CONSTRAINT FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB DEFAULT CHARSET= utf8mb4 COLLATE =  utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;