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

        Console.log('       connecting');
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
        Console.log('       this._requests keys ' + Object.keys(this._requests));

        const keys = Object.keys(this._requests);

        for (let i = 0; i < keys.length; ++i) {

            Console.log('     ##### initialize request');
            //Console.log('     this.connection ' + Object.keys(this.connection));

            // Console.log('       _requests[' + this._requests[keys[i]].name + '].name ' + this._requests[keys[i]].name);

            const F = function () {};

            F.prototype.request = function () {

                const params = arguments;

                return internals.context.connect((err, connection) => {

                    internals.context.connection = connection;
                    // const handlerString = internals.context._requests[keys[i]].handler.toString();
                    const handler = internals.context._requests[keys[i]].handler;
                    // Console.log(handlerString);
                    Console.log('       # completed this.connect err: ' + err + ' result:' + Object.keys(connection));

                    return handler.apply(internals.context, params);

                });
            };

            const newRequest = new F().request;

            newRequest('boom', (err, result) => {

                if (!err) {

                    Console.info('       ** result' + result);
                }
            });
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
            internals.plugin.connection = this.connection;

            const next = 'filler';

            plugin.register(internals.plugin, null, next);

            this._registrations.push(internals.plugin);
        }

        return callback(null, '     success _composing database completed.');
    }
};
