CREATE DATABASE buduanwangde315;		/*创建BuDuanWangDe_315数据库*/

CREATE TABLE IF NOT EXISTS `user` (   		
    id SMALLINT UNSIGNED KEY AUTO_INCREMENT,   /*id无符号数以增加可表示的范围/
    username VARCHAR(32) UNIQUE NOT NULL,	/*用户名*/
    name VARCHAR(32) NOT NULL,          /*昵称/
    password VARCHAR(32) NOT NULL,	/*登陆密码*/
    rank SMALLINT UNSIGNED NOT NULL DEFAULT 1100,  /*排名分初始为1100*/
    firstGame BOOL DEFAULT 1  /*判定是否第一次进入游戏*/
)ENGINE=INNODB CHARSET=UTF8;
