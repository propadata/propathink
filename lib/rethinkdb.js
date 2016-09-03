'use strict';

const Plugin = require('./plugin');
const Console = require('better-console');
const Rethinkdb = require('rethinkdb');
const Hoek = require('hoek');

const internals = {};

exports = module.exports = internals.Db = class {

    constructor(connection, options) {

        // @todo validate database object.

        this._connection = connection;
        this.connection = {};
        this.options = options;
        this._registrations = [];
        this._requests = {};            // registrations are composed into _requests.
        this.requests = {};             // registrations are initialized into requests.
        internals.context = this;

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

        // Console.log('       connecting');
        // Console.log('       connection object: ' + JSON.stringify(this._connection));

        const options = Hoek.clone(this._connection);

        delete options.live;
        delete options.type;
        delete options.registrations;

        Console.log('       conn options object: ' + JSON.stringify(options));

        Rethinkdb.connect(options, (err, conn) => {

            return callback(err, conn);
        });
    }

    _initialize(callback) {

        Console.log('     ##### _initializing database starting');

        const pluginNames = Object.keys(this._requests);
        const loadedRequests = [];

        // loop through each plugin.

        for (let i = 0; i < pluginNames.length; ++i) {

            Console.info('$$ pluginKey ' + pluginNames[i] + ' ' +  i);
            const plugin = this._requests[pluginNames[i]];

            Console.info('$$ plugin ' + Object.keys(plugin));

            const functionKeys = Object.keys(plugin);

            // build each function for plugin
            //  * build the function
            //  * generate documentation

            for (let j = 0; j < functionKeys.length; ++j) {

                Console.info('$$ request ' + functionKeys[j]);
                Console.info('function name ' + plugin[functionKeys[j]].name);
                Console.info('function comment ' + plugin[functionKeys[j]].comment);

                const F = function () {};

                F.prototype.request = function () {

                    const params = arguments;
                    Console.info('$$ request ' + functionKeys[j]);
                    Console.info('function name ' + plugin[functionKeys[j]].name);
                    Console.info('function comment ' + plugin[functionKeys[j]].comment);
                    Console.info(Object.keys(internals.context));

                    return internals.context.connect((err, connection) => {

                        if (!err) {

                            internals.context.connection = connection;
                            Console.info('       pass connection' + Object.keys(internals.context.connection));
                            return plugin[functionKeys[j]].handler.apply(internals.context, params);
                        }
                    });
                };

                const request = new F().request;

                loadedRequests.push(request);
            }

        };

        Console.info('loadedRequests.length ' + loadedRequests.length);
        Console.log();

        const testCallback = function (err, result) {
        
            Console.info('       ^^^^ ' + err + ' ' + result);
            return;
        };

        for (let i = 0; i < loadedRequests.length; ++i) {

            // Console.info('loadedRequests[k] ' + loadedRequests[i]);
            loadedRequests[i]('boom', testCallback);
        }


        return callback(null, 'success _intialize completed');
    }

    _compose(callback) {

        console.log('     ##### _composing database starting');
        console.log('       ' + JSON.stringify(this._connection.registrations));

        // register registrations

        console.log('       this.options.relativeTo: ' + this.options.relativeTo);

        for (let i = 0; i < this._connection.registrations.length; ++i) {

            console.log('       plugin: ' + this.options.relativeTo + '/' + this._connection.registrations[i].plugin);

            const plugin = require(this.options.relativeTo + '/' +  this._connection.registrations[i].plugin);

            internals.plugin = new Plugin(this._connection, null, this);
            internals.plugin.name = plugin.register.attributes.name;
            internals.plugin.database = plugin.register.attributes.database;

            const next = 'filler';

            plugin.register(internals.plugin, null, next);

            this._registrations.push(internals.plugin);
        }

        return callback(null, '     success _composing database completed.');
    }
};
