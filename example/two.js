'use strict';

// const Path = require('path');

const Console = require('better-console');
const Rethinkdb = require('rethinkdb');

exports.register = (plugin, options) => {

    console.log('       register.attributes *****: ' + this.register.attributes.database);

    plugin.request([
        {
            name: 'goOne',
            comment: 'goOne documentation here.',
            handler: function (param, next, callback) {

                Console.info('       ##### goOne executed');

                Rethinkdb.dbCreate(this._connection.db).run(this.conn, (err, result) => {

                    Console.info('      result: ' + err + ' ' + result);
                    return callback(err, '     success: ' + result, next);
                });
            }
        },
        {
            name: 'goTwo',
            comment: 'goTwo documentation here.',
            handler: function (param, next, callback) {

                console.log('       hurray!!! testTwo executed: ' + param);
                return callback(null, param, next);
            }
        }
    ]);

    return;
};

exports.register.attributes = {
    database: 'rethinkitize', // database name plugin belongs to.
    name: 'Go'
};
