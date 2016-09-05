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
            handler: function (param, callback) {

                Console.info('       ##### step2Fn executed');

                Rethinkdb.dbCreate(this._connection.db).run(this.conn, (err, result) => {

                    Console.info('      result: ' + err + ' ' + result);
                    return callback(err, '     success: ' + result);
                });
            }
        },
        {
            name: 'goTwo',
            comment: 'goTwo documentation here.',
            handler: function (param, callback) {

                console.log('       hurray!!! testTwo executed: ' + param);
                return callback(null, param);
            }
        }
    ]);

    return;
};

exports.register.attributes = {
    database: 'rethinkitize', // database name plugin belongs to.
    name: 'Go'
};
