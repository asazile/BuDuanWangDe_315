var express = require('express');
var router = express.Router();

const ResObject = require('../models/Usually/ResObject');

const Login = require('../models/Users/Login');

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

router.post('/rigister', function (req, res, next) {
    let username = req.body.username,
        name = req.body.name,
        password = req.body.password;

    Login.rigister(username, name, password, function (err) {
        if(err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        res.redirect(307, '/login');
    });
});

router.post('/checkUsername', function (req, res, next) {
    let username = req.body.username;

    Login.checkUsername(username, function (err, exist) {
        if(err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        if(exist) {
            let result = new ResObject(0, '账号已存在');
            res.json(result);
            return false;
        }else {
            let result = new ResObject(1);
            res.json(result);
        }
    });
});

router.get('/checkLogin', function (req, res, next) {
    let userInfo = req.session.userInfo;

    if(userInfo) {
        let result = new ResObject(1);

        res.json(result);

    }else {
        let result = new ResObject(0);

        res.json(result);

    }
});

router.get('/loginUserInfo', function (req, res, next) {
    let userInfo = req.session && req.session.userInfo;

    if(userInfo) {
        let result = new ResObject(1, '用户已登陆', {
            username: userInfo.username,
            name: userInfo.name,
            rank: userInfo.rank
        });

        res.json(result);

    }else {
        let result = new ResObject(0, '您还没有登陆，请登录后再试...');

        res.json(result);

    }
});

module.exports = router;
