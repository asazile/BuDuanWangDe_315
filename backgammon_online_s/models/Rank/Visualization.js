const fs = require('fs');

const connPool = require('../Common/connPool');

const { LOG } = require('../Usually/LocalConst');

module.exports = {
    rankDistribution: function (callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'SELECT * FROM (SELECT count(*) AS \'0-899\' FROM user WHERE rank BETWEEN 0 AND 899) a, (SELECT count(*) AS \'900-1099\' FROM user WHERE rank BETWEEN 900 AND 1099) b, (SELECT count(*) AS \'1100-1399\' FROM user WHERE rank BETWEEN 1100 AND 1399) c, (SELECT count(*) AS \'1400-1799\' FROM user WHERE rank BETWEEN 1400 AND 1799) d, (SELECT count(*) AS \'1800-1999\' FROM user WHERE rank BETWEEN 1800 AND 1999) e, (SELECT count(*) AS \'2000-2199\' FROM user WHERE rank BETWEEN 2000 AND 2199) f, (SELECT count(*) AS \'2200-2399\' FROM user WHERE rank BETWEEN 2200 AND 2399) g, (SELECT count(*) AS \'2400-2599\' FROM user WHERE rank BETWEEN 2400 AND 2599) h, (SELECT count(*) AS \'2600-\' FROM user WHERE rank >= 2600) i;';
            let param = [];
            conn.query(sql, param, function (err, rs) {
                conn.release();

                if(err) {
                    fs.appendFile(LOG.modelsError, `Time: ${new Date().toUTCString()}\n${err.stack}\n`, 'utf8');
                    callback(new Error('数据库错误...'));
                    return false;
                }

                callback(null, rs);
            });
        });
    },

    hightRank: function (callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'SELECT user.name,user.rank,@rownum := @rownum + 1 AS rownum FROM(SELECT name,rank FROM user ORDER BY rank DESC LIMIT 0,10) AS user,(SELECT @rownum := 0)  as a;';
            let param = [];
            conn.query(sql, param, function (err, rs) {
                conn.release();

                if(err) {
                    fs.appendFile(LOG.modelsError, `Time: ${new Date().toUTCString()}\n${err.stack}\n`, 'utf8');
                    callback(new Error('数据库错误...'));
                    return false;
                }

                callback(null, rs);
            });
        });
    },

    userHistoryRank: function (id, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'SELECT thisRank, DATE_FORMAT(date,\'%m-%d\') AS date FROM qualifyingGameRecord WHERE id = ? ORDER BY date DESC LIMIT 0,10;';
            let param = [id];
            conn.query(sql, param, function (err, rs) {
                conn.release();

                if(err) {
                    fs.appendFile(LOG.modelsError, `Time: ${new Date().toUTCString()}\n${err.stack}\n`, 'utf8');
                    console.log(err.message);
                    callback(new Error('数据库错误...'));
                    return false;
                }

                callback(null, rs);
            });
        });
    }
};