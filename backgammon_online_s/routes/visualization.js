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

        /*
        *
        * [{
            '0-899': 0,
            '900-1099': 0,
            '1100-1399': 16,
            '1400-1799': 0,
            '1800-1999': 0,
            '2000-2199': 0,
            '2200-2399': 0,
            '2400-2599': 0,
            '2600-': 0 } ]
        *
        * */
        let result = new ResObject(1, '', {
            legendData: ['0-899', '900-1099', '1100-1399', '1400-1799', '1800-1999', '2000-2199', '2200-2399', '2400-2599', '2600-'],
            seriesData: rankDisRs
        });
        res.json(result);
    });
});

module.exports = router;