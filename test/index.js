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


describe('Propathink start', () => {

    it('One.testOne', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        expect(rethink.connect).to.exist();
        const pathTarget = rethink.options.relativeTo.split('/');
        expect(pathTarget[pathTarget.length - 2]).to.equal('test');
        expect(pathTarget[pathTarget.length - 3]).to.equal('propathink');

        return rethink.requests.One.testOne('testOne', rethink.next, (err, result, next) => {

            if (err)  {

                console.log('       ***** callback result err:' + err + ' result: ' + result);

                // must set err in next() to exit
                // request lifecycle.

                return done(next(err));
            }

            expect(err).to.equal(null);
            console.log('       ***** callback result err:' + err + ' result: ' + result);
            return done(next());
        });
    });

    it('One.testTwo', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        expect(rethink.connect).to.exist();
        const pathTarget = rethink.options.relativeTo.split('/');
        expect(pathTarget[pathTarget.length - 2]).to.equal('test');
        expect(pathTarget[pathTarget.length - 3]).to.equal('propathink');

        const user = {
            username: 'Jon',
            password: 'password'
        };

        return rethink.requests.One.testTwo(user, rethink.next, (err, result, next) => {

            if (err)  {

                console.log('       ***** callback result err:' + err + ' result: ' + result);

                // must set err in next() to exit
                // request lifecycle.

                return done(next(err));
            }

            console.log('       ***** callback result err:' + err + ' result: ' + result);
            return done(next());
        });
    });


    it('Plugin foundation dev', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        expect(rethink.connect).to.exist();
        const pathTarget = rethink.options.relativeTo.split('/');
        expect(pathTarget[pathTarget.length - 2]).to.equal('test');
        expect(pathTarget[pathTarget.length - 3]).to.equal('propathink');

        console.log('testone is running');

        const pthinkInternals = rethink.getInternals();

        console.log('watching this: ' + Object.keys(pthinkInternals));

        console.log(Object.keys(pthinkInternals.tools));
        console.log(Object.keys(pthinkInternals.foundation));

        return pthinkInternals.foundation.unique.testOne('hello test', rethink.next, (err, result, next) => {

            console.log('       ***** pthinkInteranls.tools.One callback result err:' + err + ' result: ' + result);
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

