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
                Console.info('       ##### foundation.unique.testOne executed');
                return callback(null, 'foundation.unique.testOne result', next);
            }
        },
        {
            name: 'testTwo',
            comment: 'testTwo documentation here.',
            handler: function (user, next, callback) {

                console.log('       hurray!!! foundation.unique.testTwo executed: ' + user);
                return callback(null, 'foundation.unique.testTwo result', next);
            }
        }
    ]);

    return;
};

exports.register.attributes = {
    name: 'unique',
    type: 'foundation'           // three types of plugins: request, tool, foundation
};
