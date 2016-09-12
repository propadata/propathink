'use strict';

const Rethinkdb = require('rethinkdb');
const Hoek = require('hoek');
const Console = require('better-console');

const Request = require('./request');
const Plugin = require('./plugin');
const Foundation = require('./foundation');

const internals = {};
const pthinkInternals = {};

exports = module.exports = internals.Db = class {

    constructor(connection, options, developmentOptions) {

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


        // configurations

        pthinkInternals.configs = {};

        pthinkInternals.compositionOptions = {
            relativeTo:  options.relativeTo
        };

        pthinkInternals.developmentOptions = {
            consoleTracker: developmentOptions.consoleTracker,
            logfile: developmentOptions.logfile
        };

        internals.context = this;

        this._compose((err, result) => {

            const abortMessage = 'Abort propathink failed to compose plugins.';

            Hoek.assert(err === null, abortMessage);

            this._initialize((err, result2) => {

                Hoek.assert(err === null, abortMessage);

                console.log('     _intialize completed ' + result2);
            });


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
                // Console.info('       ##### plugin.type ' + plugin.type);
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

            // @todo validate plugin

            internals.plugin = new Plugin(pthinkInternals._connection,
                foundationPlugin.register.attributes,
                null,
                pthinkInternals);

            foundationPlugin.register(internals.plugin, null, pthinkInternals);

            pthinkInternals._registrations.push(internals.plugin);
        }

        // compose registrations
        // register requests and tools

        let file = '';

        for (let i = 0; i < pthinkInternals._connection.registrations.length; ++i) {

            file = this.options.relativeTo + '/' + pthinkInternals._connection.registrations[i].plugin;

            // Fs.access(file, (err) => {

            //     if (err) {

            //         return callback(err, 'failed to access plugin file.');
            //     }
            // });

            const plugin = require(file);

            internals.plugin = new Plugin(pthinkInternals._connection,
                plugin.register.attributes,
                null,
                pthinkInternals);

            plugin.register(internals.plugin, null, pthinkInternals);

            pthinkInternals._registrations.push(internals.plugin);
        }

        return callback(null, '     success _composing database completed.');
    }

    print(type, plugin) {

        Console.info('  beautiful: type: ' + type + ' context: ' + plugin);
    }

    getInternals() {

        return pthinkInternals;
    }
};
