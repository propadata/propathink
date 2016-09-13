'use strict';

// const Path = require('path');

// const Console = require('better-console');
const Rethinkdb = require('rethinkdb');
const Joi = require('joi');

exports.register = (plugin, options, pthinkInternals) => {

    plugin.request([
        {
            name: 'testOne',
            comment: 'testOne documentation here.',
            handler: function (param, next, callback) {

                // console.log('       testOne executed: ' + param);
                // Console.info('       ##### testOne executed');
                // Console.info('       testOne this.connection ' + Object.keys(this.conn));
                // Console.info('       - connection ' + Object.keys(this.requests));
                // Console.info('       - next ' + next);

                return Rethinkdb.dbCreate(pthinkInternals.db).run(this.conn, (err, result) => {

                    // Console.info('      testOne result: ' + err + ' ' + result);
                    return callback(err, '     success: ' + result, next);
                });
            }
        },
        {
            name: 'testTwo',
            comment: 'testTwo documentation here.',
            validate: {
                0: { // parameter at arguments[0] to be validated.
                    username: Joi.string().min(3).max(6),
                    password: Joi.string().min(3).max(8)
                }
            },
            handler: function (user, next, callback) {

                // console.log('       hurray!!! testTwo executed: ' + param);
                return callback(null, 'test two result', next);
            }
        }
    ]);

    return;
};

exports.register.attributes = {
    database: 'rethinkitize', // database name plugin belongs to.
    name: 'One',
    type: 'request'           // three types of plugins: request, tool, foundation
};
