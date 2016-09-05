'use strict';

const Request = require('./request');
const Plugin = require('./plugin');
const Console = require('better-console');
const Rethinkdb = require('rethinkdb');
const Hoek = require('hoek');
// const Async = require('async');

const internals = {};

exports = module.exports = internals.Db = class {

    constructor(connection, options) {

        // @todo validate database object.

        this._connection = connection;
        this.options = options;
        this._registrations = [];  // plugins loaded into registrations.
        this.requests = {};
        this.conn = {};
        internals.context = this;

        this._compose((err, result) => {

            if (!err) {

                console.log('       _compose completed: ' + result);

                this._initialize((err, result2) => {

                    if (!err) {

                        console.log('     _intialize completed ' + result2);
                    }
                });
            }
        });
    }

    connect(callback) {

        // Console.log('       connecting');
        // Console.log('       _connection object: ' + JSON.stringify(this._connection));

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

        // loop through each registrations

        this._registrations.forEach((plugin, index, registrations) => {

            this.requests[plugin.name] = {};

            plugin.requests.forEach((request, jndex, requests) => {

                const requestBuilder = Request.call(this);
                requestBuilder.initiate(plugin.name, request);
            });

        });

        return callback(null, '       success _intialize completed');
    }

    _compose(callback) {

        console.log('     ##### _composing database starting');

        // compose registrations

        for (let i = 0; i < this._connection.registrations.length; ++i) {

            const plugin = require(this.options.relativeTo + '/' +

            this._connection.registrations[i].plugin);

            internals.plugin = new Plugin(this._connection, plugin.register.attributes, null, this);

            plugin.register(internals.plugin, null);

            this._registrations.push(internals.plugin);
        }

        return callback(null, '     success _composing database completed.');
    }

    _initializeBackup(callback) {

        Console.log('     ##### _initializing database starting');

        const pluginNames = Object.keys(this._requests);

        // loop through each plugin.

        for (let i = 0; i < pluginNames.length; ++i) {

            // Console.info('$$ pluginKey ' + pluginNames[i] + ' ' +  i);
            const plugin = this._requests[pluginNames[i]];

            internals.context.requests[pluginNames[i]] = {};

            // Console.info('$$ plugin ' + Object.keys(plugin));

            const functionKeys = Object.keys(plugin);

            // build each function for plugin
            //  * build the function
            //  * generate documentation

            for (let j = 0; j < functionKeys.length; ++j) {

                const F = function () {};

                F.prototype.request = function () {

                    const params = arguments;

                    // Console.info('$$ request ' + functionKeys[j]);
                    // Console.info('function name ' + plugin[functionKeys[j]].name);
                    // Console.info('function comment ' + plugin[functionKeys[j]].comment);
                    // Console.info(Object.keys(internals.context));

                    return internals.context.connect((err, conn) => {

                        if (!err) {

                            internals.context.connection = conn;
                            // Console.info('       pass connection' + Object.keys(internals.context.connection));
                            return plugin[functionKeys[j]].handler.apply(internals.context, params);
                        }
                    });
                };

                const request = new F().request;

                internals.context.requests[pluginNames[i]][plugin[functionKeys[j]].name] = request;
            }

        };
    }
};
