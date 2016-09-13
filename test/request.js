'use strict';

const Code = require('code');
const Lab = require('lab');
const Propathink = require('..');
const Rethinkdb = require('rethinkdb');
const Fs = require('fs');

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('propathink.request', () => {

    it('propathink.rethinkdb.connect fail', (done) => {

        // mock connect fail

        internals.connectOriginal = Rethinkdb.connect;

        Rethinkdb.connect = (options, callback) => {

            Rethinkdb.connect = internals.connectOriginal;
            return callback(new Error('mock rethinkdb.connect failure.'), null);
        };


        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        const pathTarget = rethink.options.relativeTo.split('/');

        expect(rethink.connect).to.exist();
        expect(pathTarget[pathTarget.length - 2]).to.equal('test');
        expect(pathTarget[pathTarget.length - 3]).to.equal('propathink');

        const pthinkInternals = rethink.getInternals();

        return pthinkInternals.tools.One.testOne('hello test', rethink.next, (err, result, next) => {

            expect(err.name).to.equal('Error');
            return done();
        });
    });

    it('propathink.request joi validation failure', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        const user = {
            username: 'Jon',
            password: 'pa'
        };

        return rethink.requests.One.testTwo(user, rethink.next, (err, result, next) => {

            expect(err.name).to.equal('ValidationError');
            return done();
        });
    });

    it('propathink.print coverage', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        rethink.print();
        return done();
    });

    it('tracker mock Fs.appendFile error', (done) => {

        internals.bkup = Fs.appendFile;

        Fs.appendFile = (file, data, callback) => {

            Fs.appendFile = internals.bkup;

            return callback(new Error('mock Fs.appendFile error.'));
        };

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        const pthinkInternals = rethink.getInternals();

        return pthinkInternals.tools.One.testOne('hello test', rethink.next, (err, result, next) => {

            // console.log('       ***** tracker mock Fs.appendFile error: callback result err:' + err + ' result: ' + result);
            expect(err).to.equal(null);
            return done(next());
        });
    });

    it('tracker mock passes', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions, internals.manifest.developmentOptions);

        const pthinkInternals = rethink.getInternals();

        return pthinkInternals.tools.One.testOne('hello test', rethink.next, (err, result, next) => {

            // console.log('       ***** track mocker passes callback result err:' + err + ' result: ' + result);
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
        consoleTracker: true,              // true prints performance to console. file log always exists.
        logfile: 'logs/tracker.txt'
    }
};
