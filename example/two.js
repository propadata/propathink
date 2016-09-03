'use strict';

// const Path = require('path');

const Console = require('better-console');
const Rethinkdb = require('rethinkdb');

exports.register = (plugin, options, next) => {

    console.log('       register.attributes *****: ' + this.register.attributes.database);

    plugin.request([
        {
            name: 'goOne',
            handler: function (param, callback) {

                // console.log('       testOne executed: ' + param);
                Console.info('       ##### step2Fn executed');
                // Console.info('       testOne this.connection ' + Object.keys(this.connection));
                // console.log('     - connection ' + this.connection);

                Rethinkdb.dbCreate('goDatabase').run(this.connection, (err, result) => {

                    Console.info('      result: ' + err + ' ' + result);
                    return callback(err, '     success: ' + result);
                });
            },
            comment: 'goOne documentation here.'
        },
        {
            name: 'goTwo',
            handler: function (param, callback) {

                console.log('       testTwo executed: ' + param);
                return param;
            },
            comment: 'goTwo documentation here.'
        }
    ]);

    return;
};

exports.register.attributes = {
    database: 'rethinkitize', // database name plugin belongs to.
    name: 'Go'
};
