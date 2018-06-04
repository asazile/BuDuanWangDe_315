CREATE DATABASE buduanwangde315;		/*创建buduanwangde315数据库*/

CREATE TABLE IF NOT EXISTS `user` (   		/*创建user表*/
    id SMALLINT UNSIGNED KEY AUTO_INCREMENT,   /*id用无符号正数，id自增加*/
    username VARCHAR(32) UNIQUE NOT NULL,	/*用户名唯一*/
    name VARCHAR(32) NOT NULL,          /*昵称*/
    password VARCHAR(32) NOT NULL,	/*密码*/
    rank SMALLINT UNSIGNED NOT NULL DEFAULT 0  /*排名 分 */
)ENGINE=INNODB CHARSET=UTF8;