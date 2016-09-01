'use strict';

// const Path = require('path');

exports.register = (plugin, options, next) => {

    console.log('       register.attributes *****: ' + this.register.attributes.database);

    plugin.request([
        {
            name: 'testOne',
            handler: function (param, callback) {

                console.log('testOne executed: ' + param);
                // console.log('     - connection ' + this.connection);
                return callback(null, '     success: ' + param);
            }
        },
        {
            name: 'testTwo',
            handler: function (param, callback) {

                console.log('     testTwo executed: ' + param);
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
