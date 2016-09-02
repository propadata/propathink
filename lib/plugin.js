'use strict';
const Console = require('better-console');

const internals = {};

exports = module.exports = internals.Plugin = class {

    constructor(connection, options, propathink) {

        this.propathink = propathink;
        console.log('     ##### plugin intializing: ' + JSON.stringify(connection.db));
    }

    request(requestsArray) {

        Console.log('       registering plugin ' + this.name);
        Console.log('       registering request objects ' + requestsArray);

        // loop through each request and register it.

        // Console.table(requestsArray);

        for (let i = 0; i < requestsArray.length; ++i) {

            Console.log('       registering request: ' + requestsArray[i].name);
            Console.table(requestsArray[i]);
            this.propathink._requests[requestsArray[i].name] = {};
            this.propathink._requests[requestsArray[i].name] = requestsArray[i];

        }

        // Console.info(Object.keys(this.propathink.requests));
        // const functionString = this.propathink.requests.testOne.toString();
        // Console.info(functionString);

        return; // callback(null, 'callback connection here.');
    }

    _initialize(callback) {

        console.log('_initializing');
    }

    _compose(callback) {

        console.log('       _composing');
        return callback(null, 'callback connection here.');
    }

};
