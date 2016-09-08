'use strict';

const Console = require('better-console');
const Async = require('async');
const Joi = require('joi');

const internals = {};

exports = module.exports = internals.Request = function () {

    // @important How to ensure the lifecylce steps execute in appropriate order?
    // One, the next() callback function from theasync library needs to be executed
    // at the end of the callback written by the user of the api. This means:
    // * need to pass the async next callback through a parameter in the
    //   request handler written by the consumer. Then, their code can execute
    //   the next() callback signifying the request had completed and the
    //   after step of the lifecyle then can be executed.
    // * consumer executes their callback passing next() as a parameter to the callback.
    // * @hack previously placed a parameter in each handler as a filler. The parameter
    //   did nothing except create a placeholder for the async callback to be injected
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

            // build the lifecycle

            Async.waterfall([
                function (next) {

                    Console.log();
                    Console.log('LIFECYCLE BEGIN');
                    Console.log('STEP ONE');

                    console.time('connectStart');
                    return internals.context.connect((err, conn) => {

                        // params[params.length - 1] = next;
                        if (err) {

                            return errorCallback('STEP ONE CONNECTION ERROR', next);
                        }

                        internals.context.conn = conn;
                        console.timeEnd('connectStart');

                        return next();
                    });
                },
                function (next) {

                    Console.log('STEP TWO VALIDATION');

                    if (request.validate) {

                        // process validation code.

                        return Object.keys(request.validate).forEach((key, index, array) => {

                            Joi.validate(params[key], request.validate[key], (err, value) => {

                                if (err) {

                                    return errorCallback(err, next);
                                }

                                return next();
                            });
                        });
                    }

                    return next();
                },
                function (next) {

                    Console.log('STEP THREE');
                    Console.time('executeDBRequest');

                    // set next function to be called
                    // at end of callback execution.
                    // params has the next value set.

                    params[params.length - 2] = next;

                    request.handler.apply(internals.context, params);
                }
            ], (err, result) => {

                Console.log('STEP FOUR AFTER');

                if (err) {

                    Console.log('ERROR MESSAGE ' + err);
                    // return errorCallback('ASNYC ERROR IN LIFECYCLE.');
                    Console.timeEnd('totalTime');
                    return;
                }

                Console.timeEnd('executeDBRequest');
                Console.timeEnd('totalTime');

                return;
            });
        };

        const requesto = new R().request;

        // Set pluginType value this allows request plugin to generate
        // requests for foundation, tools, and reqests plugins.
        //      Console.info('$$$$$ request.type ' + pluginType);

        if ((pluginType === 'request') || (pluginType === 'tool')) {

            pluginType = pluginType + 's';
        }

        if (pluginType === 'requests') {

            this[pluginType][pluginName][request.name] = requesto;
            return;
        }

        // this.requests[pluginName][request.name] = requesto;

        pthinkInternals[pluginType][pluginName][request.name] = requesto;
        return;
    };

    return this;
};
