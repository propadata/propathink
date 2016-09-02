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

                console.log('       testOne executed: ' + param);
                Console.info('       testOne this.connection ' + Object.keys(this.connection));
                // console.log('     - connection ' + this.connection);

                // this.connection automatically set in function context.
                // @todo build request lifecycle to requests being built.

                Rethinkdb.dbCreate(this._connection.db).run(this.connection, (err, result) => {

                    Console.info('      result: ' + err + ' ' + result);
                    return callback(err, '     success: ' + result);
                });
                // make rethinkdb request
            }
        },
        {
            name: 'testTwo',
            handler: function (param, callback) {

                console.log('       testTwo executed: ' + param);
                return param;
            }
        }
    ]);

    return;
};

exports.register.attributes = {
    database: 'rethinkitize', // database name plugin belongs to.
    name: 'One'
};
