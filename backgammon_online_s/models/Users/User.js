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
    },

    addQGameRecord: function (thisId, thisName, thisRank, matchName, isWin, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'INSERT qualifyingGameRecord(thisId, thisName, thisRank, matchName, isWin) VALUES(?, ?, ?, ?, ?);';
            let param = [thisId, thisName, thisRank, matchName, isWin];
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
    },

    searchQGameRecord: function (id, page, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'SELECT id, thisName AS user, matchName AS adversary, isWin AS result, DATE_FORMAT(date,\'%Y-%m-%d %H:%i:%s\') AS time FROM qualifyingGameRecord WHERE thisId = ? ORDER BY date DESC LIMIT ?,10;';
            let param = [id, page*10];
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

    addMGameRecord: function (thisId, thisName, matchName, isWin, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'INSERT matchingGameRecord(thisId, thisName, matchName, isWin) VALUES(?, ?, ?, ?);';
            let param = [thisId, thisName, matchName, isWin];
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
    },

    searchMGameRecord: function (id, page, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'SELECT id, thisName AS user, matchName AS adversary, isWin AS result, DATE_FORMAT(date,\'%Y-%m-%d %H:%i:%s\') AS time FROM matchingGameRecord WHERE thisId = ? ORDER BY date DESC LIMIT ?,10;';
            let param = [id, page*10];
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

    updateRank: function (id, addRank, callback) {
        let pool = connPool();

        pool.getConnection(function (err, conn) {
            if(err) {
                callback(err);
                return false;
            }

            let sql = 'UPDATE user SET rank = rank + ? WHERE id = ?;';
            let param = [addRank, id];
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