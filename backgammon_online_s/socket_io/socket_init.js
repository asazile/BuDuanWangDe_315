//const matching = require('./nameSpace/matching');
const qualifying = require('./nameSpace/qualifying');

module.exports = function (io) {

    /**
     * io operate
     */

    io.origins((origin, callback) => {
        if (origin !== 'http://localhost:8080/' && origin !== 'http://123.206.175.49:3000/') {
            return callback('origin not allowed', false);
        }
        callback(null, true);
    });


    /**
     * multiple namespace
     */

    //const matchingNameSpace = io.of('/matching');
    const qualifyingNameSpace = io.of('/qualifying');


    /**
     * mount namespace
     */

    //matching(matchingNameSpace);
    qualifying(qualifyingNameSpace);
};