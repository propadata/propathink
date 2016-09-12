'use strict';

const Code = require('code');
const Lab = require('lab');
const Propathink = require('..');

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('foundation.core', () => {

    it('foundation.core testOne', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        const pthinkInternals = rethink.getInternals();

        return pthinkInternals.foundation.core.testOne('hello test', rethink.next, (err, result, next) => {

            expect(err).to.equal(null);
            return done(next());
        });
    });

    it('foundation.core testOne', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        const pthinkInternals = rethink.getInternals();

        return pthinkInternals.foundation.core.testTwo('hello test', rethink.next, (err, result, next) => {

            expect(err).to.equal(null);
            return done(next());
        });
    });
});

describe('foundation.unique', () => {

    it('foundation.unique testOne', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        const pthinkInternals = rethink.getInternals();

        return pthinkInternals.foundation.unique.testOne('hello test', rethink.next, (err, result, next) => {

            expect(err).to.equal(null);
            return done(next());
        });
    });

    it('foundation.unique testTwo', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        const pthinkInternals = rethink.getInternals();

        return pthinkInternals.foundation.unique.testTwo('hello test', rethink.next, (err, result, next) => {

            expect(err).to.equal(null);
            return done(next());
        });
    });
});

internals.manifest = {

    connection: {
        db: 'rethinkitize',
        type: 'rethinkdb',
        host: 'localhost',
        port: 28015,
        user: 'admin',
        password: '',
        live: false,
        registrations: [
            {
                plugin: 'example/one.js',
                options: null
            },
            {
                plugin: 'example/onetool.js',
                options: null
            },
            {
                plugin: 'example/two.js',
                options: null
            }
        ]
    },
    compositionOptions: {
        relativeTo: __dirname + '/..'
    },
    developmentOptions: {
        consoleTracker: false,              // true prints performance to console. file log always exists.
        logfile: 'logs/tracker.txt'
    }
};
