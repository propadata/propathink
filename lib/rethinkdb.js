'use strict';

const Request = require('./request');
const Plugin = require('./plugin');
const Console = require('better-console');
const Rethinkdb = require('rethinkdb');
const Hoek = require('hoek');

const internals = {};

exports = module.exports = internals.Db = class {

    constructor(connection, options) {

        // @todo validate database object.

        this._connection = connection;
        this.options = options;
        this._registrations = [];  // plugins loaded into registrations.
        this.requests = {};
        this.conn = {};
        this.next = '';  // set dynamically in request lifecycle.

        internals.context = this;

        this._compose((err, result) => {

            if (!err) {

                // console.log('       _compose completed: ' + result);

                this._initialize((err, result2) => {

                    if (!err) {

                        console.log('     _intialize completed ' + result2);
                    }
                });
            }
        });
    }

    connect(callback) {

        const options = Hoek.clone(this._connection);

        delete options.live;
        delete options.type;
        delete options.registrations;

        Rethinkdb.connect(options, (err, conn) => {

            return callback(err, conn);
        });
    }

    _initialize(callback) {

        Console.log('     ##### _initializing database starting');

        // loop through each registration initiate the plugin.

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
};
