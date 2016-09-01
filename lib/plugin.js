'use strict';

const internals = {};

exports = module.exports = internals.Plugin = class {

    constructor(connection, options) {

        console.log('     ##### plugin intializing: ' + JSON.stringify(connection.name));
    }

    request(requestsArray) {

        console.log('       registering' + requestsArray);
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
