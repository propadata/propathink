'use strict';

const Console = require('better-console');
const Async = require('async');
const Joi = require('joi');
const Tracker = require('./tracker');

const internals = {};

exports = module.exports = internals.Request = function () {

    // @important How to ensure the lifecylce steps execute in appropriate order?
    // One, the next() callback function from the async library needs to be executed
    // at the end of the callback written by the user of the api. This means:
    // * need to pass the async next callback through a parameter in the
    //   request handler written by the consumer. Then, their code can execute
    //   the next() callback signifying the request had completed and the
    //   after step of the lifecyle then can be executed.
    // * consumer executes their callback passing next() as a parameter to the callback.
    // * @hack To pass the async next() back to the handler, placed a parameter in each handler as a filler.
    //   The parameter did nothing except create a placeholder for the async callback to be injected
    //   into when the request function was built. Originally, called this param rethink.next.
    //
    // Thinking about how to improve tracking.
    // Make an object called "Tracker". Tracker would be passed as a parameter to the request.
    // When the request is build would use tracker to track and log requests and their performance.
    // Perhaps, tracker would have it's own database to log tracking records. This begins the tracking system.
    //
    // What do I want from tracker?
    // * when configured print tracker log.
    // * when configured write tracker log to file.

    this.initiate = (pluginName, pluginType, request, pthinkInternals) => {

        internals.context = this;

        // Build request

        const R = function () {};

        R.prototype.request = function () {

            console.time('totalTime');

            // const totalTimeStart = Date.now();
            const params = [];

            console.log('## arguments length ' + arguments.length);

            for (let i = 0; i < arguments.length; ++i) {

                // console.log('here:-) ' + arguments[i]);

                params.push(arguments[i]);
            }


            // @todo validate supplied callback's function parameters.
            // * ensure callback is a function.
            // * ensure callback has two parameters: error & result.
            //   or should it just be a minimum of two parameters?
            //   return callback() with appropriate error message.

            const errorCallback = function (err, next) {

                // Console.log('ERROR O NO');
                return params[params.length - 1](err, null, next);
            };

            const totalTimeStart = Date.now();

            // build the lifecycle

            Async.waterfall([
                function (next) {

                    Console.log();
                    Console.log('LIFECYCLE BEGIN');
                    Console.log('STEP ONE');

                    console.time('connectStart');

                    const connectStart = Date.now();

                    return internals.context.connect((err, conn) => {

                        // params[params.length - 1] = next;

                        const connectStartEnd = Date.now();

                        if (err) {

                            Tracker.track('createDbConnection', err, pthinkInternals, pluginType, pluginName, request.name, connectStart, connectStartEnd);
                            return errorCallback(err, next);
                            // return errorCallback('STEP ONE CONNECTION ERROR', next);
                        }

                        internals.context.conn = conn;

                        Tracker.track('createDbConnection', null, pthinkInternals, pluginType, pluginName, request.name, connectStart, connectStartEnd);

                        return next();
                    });
                },
                function (next) {

                    Console.log('STEP TWO VALIDATION');

                    internals.executeValidationStart = Date.now();

                    if (request.validate) {

                        // process validation code.

                        return Object.keys(request.validate).forEach((key, index, array) => {

                            Joi.validate(params[key], request.validate[key], (err, value) => {

                                //  delete internals.requestValidate;

                                internals.executeValidationEnd = Date.now();

                                if (err) {

                                    Tracker.track('requestValidation', err, pthinkInternals, pluginType, pluginName, request.name, internals.executeValidationStart, internals.executeValidationEnd);
                                    return errorCallback(err, next);
                                }

                                Tracker.track('requestValidation', err, pthinkInternals, pluginType, pluginName, request.name, internals.executeValidationStart, internals.executeValidationEnd);
                                return next();
                            });
                        });
                    }

                    // no validation occurred.

                    internals.executeValidationEnd = Date.now();
                    Tracker.track('requestValidation', null, pthinkInternals, pluginType, pluginName, request.name, internals.executeValidationStart, internals.executeValidationEnd);

                    return next();
                },
                function (next) {

                    Console.log('STEP THREE');
                    internals.executeDBRequestStart = Date.now();

                    // set next function to be called
                    // at end of callback execution.
                    // params has the next value set.

                    params[params.length - 2] = next;

                    request.handler.apply(internals.context, params);
                }
            ], (err, result) => {

                internals.executeDBRequestEnd = Date.now();
                Tracker.track('dbrequest', err, pthinkInternals, pluginType, pluginName, request.name, internals.executeDBRequestStart, internals.executeDBRequestEnd);

                Console.log('STEP FOUR AFTER');

                if (err) {

                    Console.log('ERROR MESSAGE ' + err);
                    Tracker.track('dbrequest', err, pthinkInternals, pluginType, pluginName, request.name, internals.executeDBRequestStart, internals.executeDBRequestEnd);
                    Tracker.seperator(pthinkInternals);
                    return;
                }

                const totalTimeEnd = Date.now();
                Tracker.track('requestTotalElapsedTime', err, pthinkInternals, pluginType, pluginName, request.name, totalTimeStart, totalTimeEnd);
                Tracker.seperator(pthinkInternals);

                return;
            });
        };

        const requesto = new R().request;

        // Set pluginType value this allows request plugin to generate
        // requests for foundation, tools, and reqests plugins.

        if (pluginType === 'requests') {

            this[pluginType][pluginName][request.name] = requesto;
            return;
        }

        pthinkInternals[pluginType][pluginName][request.name] = requesto;
        return;
    };

    return this;
};
