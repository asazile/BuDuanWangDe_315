CREATE DATABASE buduanwangde315;		/*����buduanwangde315���ݿ�*/

CREATE TABLE IF NOT EXISTS `user` (   		/*����user��*/
    id SMALLINT UNSIGNED KEY AUTO_INCREMENT,   /*id���޷���������id������*/
    username VARCHAR(32) UNIQUE NOT NULL,	/*�û���Ψһ*/
    name VARCHAR(32) NOT NULL,          /*�ǳ�*/
    password VARCHAR(32) NOT NULL,	/*����*/
    rank SMALLINT UNSIGNED NOT NULL DEFAULT 0  /*���� �� */
)ENGINE=INNODB CHARSET=UTF8;