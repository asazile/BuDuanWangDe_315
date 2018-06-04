var express = require('express');
var router = express.Router();

const ResObject = require('../models/Usually/ResObject');


/* GET users listing. */
router.post('/login', function(req, res, next) {
    let username = req.body.username,
        password = req.body.password;

    Login.login(username, password, function (err, thisUserAllInfo) {
        if(err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        req.session.userInfo = {
            id: thisUserAllInfo.id,
            username: thisUserAllInfo.username,
            name: thisUserAllInfo.name,
            rank: thisUserAllInfo.rank
        };

        let result = new ResObject(1, '登陆成功！', {
            username: thisUserAllInfo.username,
            name: thisUserAllInfo.name,
            rank: thisUserAllInfo.rank
        });
        res.json(result);
    });
});

module.exports = router;
