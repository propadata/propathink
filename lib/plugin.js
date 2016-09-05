'use strict';

const Console = require('better-console');
const Hoek = require('hoek');

const internals = {};

exports = module.exports = internals.Plugin = class {

    constructor(connection, attributes, options) {

        Hoek.assert(attributes.database === connection.db, 'declared database in plugin.attibutes ' +
            'does not match database declared in the connection configurations.');

        this.requests = [];
        this.name = attributes.name;
        this.database = attributes.database;

        console.log('     ##### plugin intializing: ' + JSON.stringify(connection.db));
    }

    request(requestsArray) {

        Console.log('       registering plugin ' + this.name);
        Console.log('       registering request objects ' + requestsArray);

        // @todo add requests validation here.

        // load requests.

        this.requests = requestsArray;

        return; // callback(null, 'callback connection here.');
    }

    _compose(callback) {

        console.log('       _composing');
        return callback(null, 'callback connection here.');
    }
};
