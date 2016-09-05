'use strict';

const Console = require('better-console');
const Async = require('async');

const internals = {};

exports = module.exports = internals.Request = function (context) {

    this.initiate = (pluginName, request) => {

        internals.context = this;
        Console.info('     ##### ' + Object.keys(this));
        Console.log('BUILD THIS: ' + pluginName);

        // Build request

        const R = function () {};

        R.prototype.request = function () {

            const params = arguments;


            // return internals.context.connect((err, conn) => {

            //     if (!err) {

            //         internals.context.connection = conn;

            //         return request.handler.apply(internals.context, params);
            //     }
            // });

            // build the lifecycle

            Async.waterfall([
                function (callback) {

                    console.log('STEP ONE');

                    return internals.context.connect((err, conn) => {

                        if (err) {
                            return callback(err);
                        }

                        internals.context.conn = conn;
                        return callback();
                    });
                },
                function (callback) {

                    console.log('STEP TWO');
                    request.handler.apply(internals.context, params);
                    return callback();
                },
                function (callback) {

                    console.log('STEP THREE');
                    return callback();
                }
            ], (err, result) => {

                console.log('LIFECYCLE COMPLETED err: ' + err + ' result: ' + result);
                return;

            });
        };

        const requesto = new R().request;

        // this.requests[pluginName][request.name] = request.handler;
        this.requests[pluginName][request.name] = requesto;

    };

    return this;
};

