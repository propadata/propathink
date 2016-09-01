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
        return done();
    });
});

internals.manifest = {
    connection: {
        name: 'rethinkitize',
        type: 'rethinkdb',
        host: 'localhost',
        port: 28015,
        user: 'waka',
        pw: 'wakatime',
        live: false,
        registrations: [
            {
                plugin: '../example/one.js',
                options: null
            }
        ]
    },
    compositionOptions: {
        relativeTo: __dirname
    }
};

