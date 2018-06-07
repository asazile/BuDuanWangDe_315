var express = require('express');
var router = express.Router();

const fs = require('fs');

const ResObject = require('../models/Usually/ResObject');
const { LOG } = require('../models/Usually/LocalConst');

const Login = require('../models/Users/Login');


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

module.exports = router;
