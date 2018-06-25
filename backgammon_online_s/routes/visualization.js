var express = require('express');
var router = express.Router();

const fs = require('fs');

const ResObject = require('../models/Usually/ResObject');
const { LOG } = require('../models/Usually/LocalConst');

const Visualization = require('../models/Rank/Visualization');

router.post('/rankDistribution', function (req, res, next) {
    Visualization.rankDistribution((err, rankDisRs) => {
        if(err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        let rankDisRsTemp = [],
            newData = rankDisRs[0];

        for(let key in newData) {
            let keys = {};
            keys.name = key;
            keys.value = newData[key];
            rankDisRsTemp.push(keys);
        }

        let result = new ResObject(1, '', {
            legendData: ['0-899', '900-1099', '1100-1399', '1400-1799', '1800-1999', '2000-2199', '2200-2399', '2400-2599', '2600-'],
            seriesData: rankDisRsTemp
        });
        res.json(result);
    });
});

router.post('/hightRank', function (req, res, next) {
    Visualization.hightRank((err, hRankResult) => {
        if(err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        let data = {
            yAxisData: [],
            seriesData: []
        };

        for (let i=hRankResult.length-1; i>=0; i--) {
            data.yAxisData.push(hRankResult[i].name);
            data.seriesData.push(hRankResult[i].rank);
        }

        let result = new ResObject(1, '', data);
        res.json(result);
    });
});

router.post('/userHistoryRank', function (req, res, next) {
    let id = req.session.userInfo.id;

    Visualization.userHistoryRank(id, (err, hisResult) => {
        if(err) {
            let result = new ResObject(0, err.message);
            res.json(result);
            return false;
        }

        console.log(hisResult);
        let data = {
            xAxisData: [],
            seriesData: []
        };

        for (let i=hisResult.length-1; i>=0; i--) {
            data.xAxisData.push(hisResult[i].date);
            data.seriesData.push(hisResult[i].thisRank);
        }

        let result = new ResObject(1, '', data);
        res.json(result);
    });
});

module.exports = router;