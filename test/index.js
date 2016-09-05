'use strict';

const Hoek = require('hoek');
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

    it('connect', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions);

        expect(rethink.connect).to.exist();
        const pathTarget = rethink.options.relativeTo.split('/');
        expect(pathTarget[pathTarget.length - 1]).to.equal('test');
        expect(pathTarget[pathTarget.length - 2]).to.equal('propathink');

        console.log('END test keys ' + Object.keys(rethink.requests.Go));
        return rethink.requests.Go.goTwo('goTwo', (err, result) => {

            console.log('       ***** err:' + err + ' result: ' + result);
            return done();
        });
    });

    it('connect2', (done) => {

        const rethink = new Propathink.DB(internals.manifest.connection, internals.manifest.compositionOptions);

        expect(rethink.connect).to.exist();
        const pathTarget = rethink.options.relativeTo.split('/');
        expect(pathTarget[pathTarget.length - 1]).to.equal('test');
        expect(pathTarget[pathTarget.length - 2]).to.equal('propathink');

        console.log('END test keys ' + Object.keys(rethink.requests.One));
        return rethink.requests.One.testOne('testOne', (err, result) => {

            console.log('       ***** err:' + err + ' result: ' + result);
            return done();
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
                plugin: '../example/one.js',
                options: null
            },
            {
                plugin: '../example/two.js',
                options: null
            }
        ]
    },

    compositionOptions: {
        relativeTo: __dirname
    }
};

