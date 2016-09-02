'use strict';

const internals = {};
const Plugin = require('./plugin');
const Console = require('better-console');

exports = module.exports = internals.Db = class {

    constructor(connection, options) {

        // @todo validate database object.

        this.connection = connection;
        this.options = options;
        this._registrations = [];
        this._requests = {};            // registrations are composed into _requests.
        this.requests = {};             // registrations are initialized into requests.

        console.log('constructing' + JSON.stringify(this.database));

        this._compose((err, result) => {

            if (!err) {

                console.log('       _compose completed: ' + result);

                this._initialize((err, result2) => {

                    if (!err) {

                        console.log('       _intialize completed ' + result2);
                    }
                });
            }
        });
    }

    connect(callback) {

        console.log('connecting');


        return callback(null, 'callback connection here.');
    }

    _initialize(callback) {

        Console.log('     ##### _initializing database starting');
        Console.log('       this._requests keys ' + Object.keys(this._requests));

        const keys = Object.keys(this._requests);

        for (let i = 0; i < keys.length; ++i) {

            Console.info('     ##### initialize request');
            Console.log('     this.connection ' + Object.keys(this.connection));

            Console.log('       _requests[' + this._requests[keys[i]].name + '].name ' + this._requests[keys[i]].name);

            // build connection function
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

            internals.plugin = new Plugin(this.connection, null, this);
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
