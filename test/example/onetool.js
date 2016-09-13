'use strict';

const Code = require('code');
const Lab = require('lab');
const Propathink = require('../..');

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('tool.One', () => {

    it('pthinkInternals.tools.One.testTwo', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        expect(rethink.connect).to.exist();
        const pathTarget = rethink.options.relativeTo.split('/');
        expect(pathTarget[pathTarget.length - 4]).to.equal('test');
        expect(pathTarget[pathTarget.length - 5]).to.equal('propathink');

        // console.log('END test keys ' + Object.keys(rethink.requests.One));

        const pthinkInternals = rethink.getInternals();

        return pthinkInternals.tools.One.testTwo('testTwo', rethink.next, (err, result, next) => {

            if (err)  {

                // console.log('       ***** callback result err:' + err + ' result: ' + result);

                // must set err in next() to exit
                // request lifecycle.

                return done(next(err));
            }

            // console.log('       ***** callback result err:' + err + ' result: ' + result);
            return done(next());
        });
    });

    it('pthinkInternals.tools.One.testOne', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        expect(rethink.connect).to.exist();
        const pathTarget = rethink.options.relativeTo.split('/');
        expect(pathTarget[pathTarget.length - 4]).to.equal('test');
        expect(pathTarget[pathTarget.length - 5]).to.equal('propathink');

        const pthinkInternals = rethink.getInternals();

        // console.log(Object.keys(pthinkInternals.tools));
        // console.log(Object.keys(pthinkInternals.foundation));

        return pthinkInternals.tools.One.testOne('hello test', rethink.next, (err, result, next) => {

            expect(err).to.equal(null);
            // console.log('       ***** pthinkInteranls.tools.One callback result err:' + err + ' result: ' + result);
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
        relativeTo: __dirname + '/../..'
    },
    developmentOptions: {
        consoleTracker: false,              // true prints performance to console. file log always exists.
        logfile: 'logs/tracker.txt'
    }
};
