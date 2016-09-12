'use strict';

// const Path = require('path');

const Console = require('better-console');
// const Rethinkdb = require('rethinkdb');
// const Joi = require('joi');

exports.register = (plugin, options, pthinkInternals) => {

    plugin.request([
        {
            name: 'testOne',
            comment: 'testOne documentation here.',
            handler: function (param, next, callback) {

                // console.log('       testOne executed: ' + param);
                Console.info('       ##### foundation.core.testOne executed');
                return callback(null, 'foundation.core.testOne result', next);
            }
        },
        {
            name: 'testTwo',
            comment: 'testTwo documentation here.',
            handler: function (param, next, callback) {

                console.log('       hurray!!! foundation.core.testTwo executed: ' + param);
                return callback(null, 'foundation.core.testOne result', next);
            }
        }
    ]);

    return;
};

exports.register.attributes = {
    name: 'core',
    type: 'foundation'           // three types of plugins: request, tool, foundation
};
