'use strict';

const { assert } = require('console');

// Groups.switch is of type (string, string, int) => void
module.exports = function (Groups) {
    Groups.switch = async function (switchFrom, switchTo, uid) {
        assert(typeof (switchFrom) === 'string');
        assert(typeof (switchTo) === 'string');
        assert(typeof (uid) === 'number');

        await Groups.leave(switchFrom, uid);
        await Groups.join(switchTo, uid);
    };
};
