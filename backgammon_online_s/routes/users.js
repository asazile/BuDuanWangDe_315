var express = require('express');
var router = express.Router();

const fs = require('fs');

const ResObject = require('../models/Usually/ResObject');
const { LOG } = require('../models/Usually/LocalConst');

const Login = require('../models/Users/Login');
const User = require('../models/Users/User');
const ELO = require('../models/Rank/ELO');


/* GET users listing. */
router.post('/changePassword', function(req, res, next) {
    let password = req.body.password,
        id = req.session.userInfo.id;

    if ( !(id>=0 && password) ) {
        let result = new ResObject(0, '参数错误...请重试...');
        res.json(result);
        return false;
    }

    Login.changePassword(id, password, function (err) {
        if(err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        let result = new ResObject(1, '修改成功！');
        res.json(result);
    });
});

router.post('/checkFirstGame', function (req, res, next) {
    let id = req.session.userInfo.id;

    if (!(id>=0)) {
        let result = new ResObject(0, '参数错误...请重试...');
        res.json(result);
        return false;
    }

    User.checkFirstGame(id, function (err, isFirstGame) {
        if (err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        let status = isFirstGame ? 1 : 0;
        let result = new ResObject(status);
        res.json(result);
    })
});

router.post('/updateFirstGame', function (req, res, next) {
    let id = req.session.userInfo.id;

    if (!(id && id>=0)) {
        let result = new ResObject(0, '参数错误...请重试...');
        res.json(result);
        return false;
    }

    User.updateFirstGame(id, function (err) {
        if (err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        let result = new ResObject(1, 'Update success.');
        res.json(result);
    })
});

router.post('/addQGameRecord', function (req, res, next) {
    let thisId = req.session.userInfo.id,
        thisName = req.session.userInfo.name,
        matchName = req.body.matchName,
        isWin = req.body.isWin;

    if (!(thisId && thisId >= 0)) {
        let result = new ResObject(0, '参数错误...请重试...');
        res.json(result);
        return false;
    }

    User.addQGameRecord(thisId, thisName, matchName, isWin, function (err) {
        if (err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        let result = new ResObject(1);
        res.json(result);
    });

});

router.post('/getQGameRecord', function (req, res, next) {
    let id = req.session.userInfo.id,
        page = req.body.page;

    if (!(id && id >= 0 && page >= 0)) {
        let result = new ResObject(0, '参数错误...请重试...');
        res.json(result);
        return false;
    }

    User.searchQGameRecord(id, page, function (err, data) {
        if (err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        for (let i=0, len=data.length; i<len; i++) {
            let item = data[i];

            if (item.result > 0) {
                item.result = 'Win';
            } else if (item.result < 0) {
                item.result = 'Defeat';
            } else {
                item.result = 'Draw';
            }
        }

        let result = new ResObject(1, '', data);
        res.json(result);
    });
});

router.post('/addMGameRecord', function (req, res, next) {
    let thisId = req.session.userInfo.id,
        thisName = req.session.userInfo.name,
        matchName = req.body.matchName,
        isWin = req.body.isWin;

    if (!(thisId && thisId >= 0)) {
        let result = new ResObject(0, '参数错误...请重试...');
        res.json(result);
        return false;
    }

    User.addMGameRecord(thisId, thisName, matchName, isWin, function (err) {
        if (err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        let result = new ResObject(1);
        res.json(result);
    });

});

router.post('/getMGameRecord', function (req, res, next) {
    let id = req.session.userInfo.id,
        page = req.body.page;

    if (!(id && id >= 0 && page >= 0)) {
        let result = new ResObject(0, '参数错误...请重试...');
        res.json(result);
        return false;
    }

    User.searchMGameRecord(id, page, function (err, data) {
        if (err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        for (let i=0, len=data.length; i<len; i++) {
            let item = data[i];

            if (item.result > 0) {
                item.result = 'Win';
            } else if (item.result < 0) {
                item.result = 'Defeat';
            } else {
                item.result = 'Draw';
            }
        }

        let result = new ResObject(1, '', data);
        res.json(result);
    });
});

router.post('/changeRank', function (req, res, next) {
    let id = req.session.userInfo.id,
        rA = req.body.rA,
        rB = req.body.rB,
        isWin = req.body.isWin;

    if (!(id && id >= 0)) {
        let result = new ResObject(0, '参数错误...请重试...');
        res.json(result);
        return false;
    }

    let addRank = Number(ELO(rA, rB, isWin));

    User.updateRank(id, addRank, function (err) {
        if (err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        let oldRank = req.session.userInfo.rank;
        req.session.userInfo.rank = (oldRank + addRank >= 0) ? (oldRank + addRank) : 0;

        let result = new ResObject(1, '', {
            addRank: addRank
        });
        res.json(result);
    });
});

module.exports = router;
