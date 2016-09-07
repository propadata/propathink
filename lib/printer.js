'use strict';

// (function (global, factory) {
//
//
// }(this, (exports) => {
//
//     const print = (text) => {
//
//         Console.info(this + ' ' + text);
//     };
//
//     exports.test = function () {
//
//         Console.info(' ' + text);
//     };
//
//     const index = {
//         print
//     };
//
//     // exports.boom = boom2;
//
//     // exports['default'] = index;
//
//     exports = module.exports = index;
// }));
//
//exports = exports.module = internals.Printer = function () {
//
//    this.print = (text) => {
//
//        console.log('Printer.print ' + text);
//    }
//
//    return this;
//};

const internals = {};

const print = function () {


    this.one = 'sting';

    this.two = function (text) {

        console.log('cool.two ' + text);
        return 'go';
    };

    this.two.boom = function () {

        return 'two.boom';
    };

    return this;
};

print.prototype.boost = function (text) {

    console.log('print ' + text);
};

print.prototype.boost.go = function (text) {

    console.log('print.boost.go ' + text);
};

const print3 = new print();

exports = module.exports = internals.Printer = {

    print3,

    print2: function (text) {

        console.log('go getem: ' + text);
    },

    print: {

        modules: function (text) {

            console.log('print.modules ' + text);
        },
        plugins: function (text) {

            console.log('print.plugins ' + text);
        }
    },

    default: function (text) {

        console.log('print.plugins ' + text);
    }
};

