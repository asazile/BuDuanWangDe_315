const fs = require('fs');

const connPool = require('../Common/connPool');

const { LOG } = require('../Usually/LocalConst');

module.exports = {
    login: function (username, password, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'SELECT * FROM user WHERE username = ?;';
            let param = [username, password];
            conn.query(sql, param, function (err, rs) {
                conn.release();

                if(err) {
                    fs.appendFile(LOG.modelsError, `Time: ${new Date().toUTCString()}\n${err.stack}\n`, 'utf8');
                    callback(new Error('数据库错误...'));
                    return false;
                }

                let thisUserAllInfo = rs[0];

                if(!thisUserAllInfo) {
                    callback(new Error('账号不存在...'));
                    return false;
                }

                if(thisUserAllInfo.password !== password) {
                    callback(new Error('密码不正确...'));
                    return false;
                }

                // thisUserAllInfo = {id: .., username: .., name: .., password: .., rank: ..}
                callback(null, thisUserAllInfo);
            });
        });
    },

    rigister: function (username, name, password, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'INSERT user(username, name, password) VALUES(?, ?, ?);';
            let param = [username, name, password];
            conn.query(sql, param, function (err, rs) {
                conn.release();

                if(err && err.message.indexOf('PRIMARY') > -1) {
                    callback(new Error('该账号已被注册...'));
                    return false;
                }

                if(err) {
                    fs.appendFile(LOG.modelsError, `Time: ${new Date().toUTCString()}\n${err.stack}\n`, 'utf8');
                    callback(new Error('数据库错误...'));
                    return false;
                }

                callback(null);
            });
        });
    },

    checkUsername: function (username, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'SELECT id FROM user WHERE username = ?;';
            let param = [username];
            conn.query(sql, param, function (err, rs) {
                conn.release();

                if(err) {
                    fs.appendFile(LOG.modelsError, `Time: ${new Date().toUTCString()}\n${err.stack}\n`, 'utf8');
                    callback(new Error('数据库错误...'));
                    return false;
                }

                let usernameExist = Boolean(rs[0]);
                callback(null, usernameExist);
            });
        });
    },

    changePassword: function (id, password, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'UPDATE user SET password = ? WHERE id = ?;';
            let param = [password, id];
            conn.query(sql, param, function (err, rs) {
                conn.release();

                if(err) {
                    fs.appendFile(LOG.modelsError, `Time: ${new Date().toUTCString()}\n${err.stack}\n`, 'utf8');
                    callback(new Error('数据库错误...请稍后再试'));
                    return false;
                }

                callback(null);
            });
        });
    }
};