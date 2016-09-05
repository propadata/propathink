'use strict';

// const Path = require('path');

const Console = require('better-console');
const Rethinkdb = require('rethinkdb');

exports.register = (plugin, options) => {

    plugin.request([
        {
            name: 'testOne',
            handler: function (param, callback) {

                // console.log('       testOne executed: ' + param);
                Console.info('       ##### testOne executed');
                Console.info('       testOne this.connection ' + Object.keys(this.conn));
                Console.info('       - connection ' + Object.keys(this.requests));

                return Rethinkdb.dbCreate(this._connection.db).run(this.conn, (err, result) => {

                    Console.info('      testOne result: ' + err + ' ' + result);
                    return callback(err, '     success: ' + result);
                });
            },
            comment: 'testOne documentation here.'
        },
        {
            name: 'testTwo',
            handler: function (param, callback) {

                // console.log('       hurray!!! testTwo executed: ' + param);
                return callback(null, param);
            },
            comment: 'testTwo documentation here.'
        }
    ]);

    return;
};

exports.register.attributes = {
    database: 'rethinkitize', // database name plugin belongs to.
    name: 'One'
};
