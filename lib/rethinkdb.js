'use strict';

const internals = {};
const Plugin = require('./plugin');

exports = module.exports = internals.Db = class {

    constructor(connection, options) {

        // @todo validate database object.

        this.connection = connection;
        this.options = options;
        this._registrations = [];
        // this.database.compositionOptions.relativeTo

        console.log('constructing' + JSON.stringify(this.database));

        this._compose((err, result) => {

            if (!err) {

                console.log('       _compose completed: ' + result);
                this._initialize((err, result) => {
                    console.log('       _intialize completed ' + result); 
                });
            }
        });
    }

    connect(callback) {

        console.log('connecting');
        return callback(null, 'callback connection here.');
    }

    _initialize(callback) {

        console.log('     ##### _initializing database starting');
        for (let i = 0; i < this._registrations.length; ++i) {

            console.log('       _registrations['+ i +'].name ' + this._registrations[i].name);
        }

        return callback(null, 'success _intialize completed');
    }

    _compose(callback) {

        console.log('     ##### _composing database starting');
        console.log('       ' + JSON.stringify(this.connection.registrations));

        // register registrations

        console.log('       this.options.relativeTo: ' + this.options.relativeTo);

        for (let i = 0; i < this.connection.registrations.length; ++i) {

            console.log('       plugin: ' + this.options.relativeTo + '/' + this.connection.registrations[i].plugin);

            const plugin = require(this.options.relativeTo + '/' +  this.connection.registrations[i].plugin);

            internals.plugin = new Plugin(this.connection, null);
            internals.plugin.name = plugin.register.attributes.name;
            internals.plugin.database = plugin.register.attributes.database;
            internals.plugin.connection = this.connection;

            const next = 'filler';

            plugin.register(internals.plugin, null, next);

            this._registrations.push(internals.plugin);
        }

        return callback(null, '     success _composing database completed.');
    }
};
