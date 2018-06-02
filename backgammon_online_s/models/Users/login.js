const connPool = require('../Common/connPool');

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
                    callback(err);
                    return false;
                }

                let thisUserAllInfo = rs[0];

                if(thisUserAllInfo) {
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

    rigister: function (username, name, password) {
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

                if(err) {
                    callback(err);
                    return false;
                }

                callback(null);
            });
        });
    }
};