'use strict';

const Console = require('better-console');

const internals = {};

exports = module.exports = internals.Request = function (context) {

    this.initiate = (pluginName, request) => {

        Console.info('     ##### ' + Object.keys(this));
        Console.log('BUILD THIS: ' + pluginName);

        this.requests[pluginName][request.name] = request.handler;
        return;
    };

    return this;
};

