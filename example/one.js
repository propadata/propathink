'use strict';

// const Path = require('path');

const Console = require('better-console');
const Rethinkdb = require('rethinkdb');

exports.register = (plugin, options, next) => {

    console.log('       register.attributes *****: ' + this.register.attributes.database);

    plugin.request([
        {
            name: 'testOne',
            handler: function (param, callback) {

                // console.log('       testOne executed: ' + param);
                Console.info('       ##### step2Fn executed');
                Console.info('       testOne this.connection ' + Object.keys(this.connection));
                Console.info('       - connection ' + Object.keys(this.requests));

                Rethinkdb.dbCreate(this._connection.db).run(this.connection, (err, result) => {

                    Console.info('      result: ' + err + ' ' + result);
                    return callback(err, '     success: ' + result);
                });
                // make rethinkdb request
            },
            comment: 'testOne documentation here.'
        },
        {
            name: 'testTwo',
            handler: function (param, callback) {

                console.log('       testTwo executed: ' + param);
                return param;
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
