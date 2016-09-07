'use strict';

// const Console = require('better-console');
const Hoek = require('hoek');

const internals = {};

exports = module.exports = internals.Plugin = class {

    constructor(connection, attributes, options, appInternals) {

        if ((attributes.type === 'request') || (attributes.type === 'tool')) {

            attributes.type = attributes.type + 's';

            Hoek.assert(attributes.database === connection.db, 'declared database in plugin.attibutes ' +
                'does not match database declared in the connection configurations.');
        }

        this.requests = [];
        this.name = attributes.name;
        this.type = attributes.type;
        this.database = attributes.database;

        internals.context = this;
    }

    request(requestsArray) {

        // Console.log('       registering plugin ' + this.name);
        // Console.log('       registering request objects ' + requestsArray);

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
