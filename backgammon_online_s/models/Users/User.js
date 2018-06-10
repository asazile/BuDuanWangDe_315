const fs = require('fs');

const connPool = require('../Common/connPool');

const { LOG } = require('../Usually/LocalConst');

module.exports = {
    checkFirstGame: function (id, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'SELECT firstGame FROM user WHERE id = ?;';
            let param = [id];
            conn.query(sql, param, function (err, rs) {
                conn.release();

                if(err) {
                    fs.appendFile(LOG.modelsError, `Time: ${new Date().toUTCString()}\n${err.stack}\n`, 'utf8');
                    callback(new Error('数据库错误...'));
                    return false;
                }

                let isFirstGame = Boolean(rs[0].firstGame);

                callback(null, isFirstGame);
            });
        });
    },

    updateFirstGame: function (id, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'UPDATE user SET firstGame = 0 WHERE id = ?;';
            let param = [id];
            conn.query(sql, param, function (err, rs) {
                conn.release();

                if(err) {
                    fs.appendFile(LOG.modelsError, `Time: ${new Date().toUTCString()}\n${err.stack}\n`, 'utf8');
                    callback(new Error('数据库错误...'));
                    return false;
                }

                callback(null);
            });
        });
    }
};