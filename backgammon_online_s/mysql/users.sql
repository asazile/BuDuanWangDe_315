CREATE DATABASE buduanwangde315;		/*创建BuDuanWangDe_315数据库*/

CREATE TABLE IF NOT EXISTS `user` (   		
    id SMALLINT UNSIGNED KEY AUTO_INCREMENT,   /*id无符号数以增加可表示的范围/
    username VARCHAR(32) UNIQUE NOT NULL,	/*用户名*/
    name VARCHAR(32) NOT NULL,          /*昵称/
    password VARCHAR(32) NOT NULL,	/*登陆密码*/
    rank SMALLINT UNSIGNED NOT NULL DEFAULT 1100,  /*排名分初始为1100*/
    historyRank VARCHAR(128) NOT NULL DEFAULT '',
    firstGame BOOL DEFAULT 1  /*判定是否第一次进入游戏*/
)ENGINE=INNODB CHARSET=UTF8;

CREATE TABLE IF NOT EXISTS `qualifyingGameRecord` (
    id INT UNSIGNED KEY AUTO_INCREMENT,
    thisId INT UNSIGNED NOT NULL,
    thisName VARCHAR(32) NOT NULL,
    matchName VARCHAR(32) NOT NULL,
    isWin SMALLINT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=INNODB CHARSET=UTF8;

CREATE TABLE IF NOT EXISTS `matchingGameRecord` (
    id INT UNSIGNED KEY AUTO_INCREMENT,
    thisId INT UNSIGNED NOT NULL,
    thisName VARCHAR(32) NOT NULL,
    matchName VARCHAR(32) NOT NULL,
    isWin SMALLINT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=INNODB CHARSET=UTF8;


SELECT * FROM
(SELECT count(*) AS '0-899' FROM user WHERE rank BETWEEN 0 AND 899) a,
(SELECT count(*) AS '900-1099' FROM user WHERE rank BETWEEN 900 AND 1099) b,
(SELECT count(*) AS '1100-1399' FROM user WHERE rank BETWEEN 1100 AND 1399) c,
(SELECT count(*) AS '1400-1799' FROM user WHERE rank BETWEEN 1400 AND 1799) d,
(SELECT count(*) AS '1800-1999' FROM user WHERE rank BETWEEN 1800 AND 1999) e,
(SELECT count(*) AS '2000-2199' FROM user WHERE rank BETWEEN 2000 AND 2199) f,
(SELECT count(*) AS '2200-2399' FROM user WHERE rank BETWEEN 2200 AND 2399) g,
(SELECT count(*) AS '2400-2599' FROM user WHERE rank BETWEEN 2400 AND 2599) h,
(SELECT count(*) AS '2600-' FROM user WHERE rank >= 2600) i;


SELECT
    user.name,user.rank,@rownum := @rownum + 1 AS rownum
FROM
    (
        SELECT
            name,
            rank
        FROM
            user
        ORDER BY
            rank DESC
            LIMIT 0,10
    ) AS user,
    (SELECT @rownum := 0)  as a;



select 
    historyRank 
from 
    user 
where 
    id='';
