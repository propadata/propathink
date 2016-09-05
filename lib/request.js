'use strict';

const Console = require('better-console');
const Async = require('async');

const internals = {};

exports = module.exports = internals.Request = function (context) {

    this.initiate = (pluginName, request) => {

        internals.context = this;

        // Build request

        const R = function () {};

        R.prototype.request = function () {

            const params = arguments;

            // simple request without lifecycle
            // return internals.context.connect((err, conn) => {

            //     if (!err) {

            //         internals.context.connection = conn;

            //         return request.handler.apply(internals.context, params);
            //     }
            // });

            // build the lifecycle

            Async.waterfall([
                function (callback) {

                    Console.log();
                    Console.log('LIFECYCLE BEGIN');
                    Console.log('STEP ONE');

                    return internals.context.connect((err, conn) => {

                        if (err) {
                            return callback(err);
                        }

                        internals.context.conn = conn;
                        return callback();
                    });
                },
                function (callback) {

                    Console.log('STEP TWO');
                    return callback();
                },
                function (callback) {

                    Console.log('STEP THREE');
                    return callback();
                }
            ], (err, result) => {

                Console.log('LIFECYCLE COMPLETED err: ' + err + ' result: ' + result);
                return request.handler.apply(internals.context, params);
            });
        };

        const requesto = new R().request;

        this.requests[pluginName][request.name] = requesto;
    };

    return this;
};
