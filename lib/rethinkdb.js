'use strict';

const Rethinkdb = require('rethinkdb');
const Hoek = require('hoek');
const Console = require('better-console');

const Request = require('./request');
const Plugin = require('./plugin');
const Foundation = require('./foundation');
const Printer = require('./printer');

const internals = {};
const pthinkInternals = {};

exports = module.exports = internals.Db = class {

    constructor(connection, options) {

        // @todo validate database object.

        this.options = options;
        this.requests = {};
        this.conn = {};
        this.next = '';  // set dynamically in request lifecycle.

        // internal application properties

        pthinkInternals._connection = connection;
        pthinkInternals.db = connection.db;
        pthinkInternals._registrations = [];  // plugins loaded into registrations.
        pthinkInternals.tools = {};
        pthinkInternals.foundation = {};

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

        const options = Hoek.clone(pthinkInternals._connection);

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

        pthinkInternals._registrations.forEach((plugin, index, registrations) => {

            if (plugin.type === 'requests') {
                this.requests[plugin.name] = {};
            }

            if (plugin.type === 'tools') {
                pthinkInternals.tools[plugin.name] = {};
            }

            if (plugin.type === 'foundation') {
                pthinkInternals.foundation[plugin.name] = {};
            }

            plugin.requests.forEach((request, jndex, requests) => {

                const requestBuilder = Request.call(this);
                requestBuilder.initiate(plugin.name, plugin.type, request, pthinkInternals);
            });
        });

        return callback(null, '       success _intialize completed');
    }

    _compose(callback) {

        console.log('     ##### _composing propathink ');

        // compose foundation
        // register foundation requests

        for (let i = 0; i < Foundation.registrations.length; ++i) {

            const foundationPlugin = require('./foundation/' + Foundation.registrations[i].plugin);

            internals.plugin = new Plugin(pthinkInternals._connection, foundationPlugin.register.attributes, null, pthinkInternals);

            foundationPlugin.register(internals.plugin, null, pthinkInternals);

            pthinkInternals._registrations.push(internals.plugin);
        }

        // compose registrations
        // register requests and tools

        for (let i = 0; i < pthinkInternals._connection.registrations.length; ++i) {

            const plugin = require(this.options.relativeTo + '/' +

            pthinkInternals._connection.registrations[i].plugin);

            internals.plugin = new Plugin(pthinkInternals._connection, plugin.register.attributes, null, pthinkInternals);

            plugin.register(internals.plugin, null, pthinkInternals);

            pthinkInternals._registrations.push(internals.plugin);
        }


        return callback(null, '     success _composing database completed.');
    }

    print(type, plugin) {

        Console.info('  beautiful: type: ' + type + ' context: ' + plugin);
        Printer.print2('hello wilmington');
        Printer.print.modules('hello wilmington');
        Printer.print3.boost('hello wilmington');
        Printer.print3.boost.go('hello wilmington');
    }

    getInternals() {

        return pthinkInternals;
    }
};
