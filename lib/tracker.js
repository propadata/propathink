'use strict';

const Console = require('better-console');
const Fs = require('fs');

const internals = {};

exports = module.exports = internals.Tracker = {

    trackbkup : function (pthinkInternals, pluginType, pluginName, fnName, start, end) {

        const consoleTrackerStatus = pthinkInternals.developmentOptions.consoleTracker;

        const message = '[tracker] ,[function]' + pluginType + '.' + pluginName + '.' + fnName + ',[totalElapsedTime]' + (end - start) + ',[Date]' + Date.now() + '\n';

        if (consoleTrackerStatus)  {

            Console.info('       ' + message);
        }

        // Console.info('Console.info ' + pthinkInternals.compositionOptions.relativeTo + '/' + pthinkInternals.developmentOptions.logfile);

        const file = pthinkInternals.compositionOptions.relativeTo + '/' + pthinkInternals.developmentOptions.logfile;

        Fs.appendFile(file, message, (err) => {

            if (err) {
                throw err;
            }

            return;
        });

    },

    track : function (label, error, pthinkInternals, pluginType, pluginName, fnName, start, end) {

        const consoleTrackerStatus = pthinkInternals.developmentOptions.consoleTracker;

        const message = '[tracker], [label]' + label + '[error]' + error + '[function]' + pluginType + '.' + pluginName + '.' + fnName + ',[totalElapsedTime]' + (end - start) + ',[Date]' + Date.now() + '\n';

        if (consoleTrackerStatus)  {

            Console.info('       ' + message);
        }

        const file = pthinkInternals.compositionOptions.relativeTo + '/' + pthinkInternals.developmentOptions.logfile;

        Fs.appendFile(file, message, (err) => {

            if (err) {
                throw err;
            }

            return;
            // console.log('The "data to append" was appended to file!');
        });

    },
    seperator: function (pthinkInternals) {

        const consoleTrackerStatus = pthinkInternals.developmentOptions.consoleTracker;

        const message = '-----\n';

        if (consoleTrackerStatus)  {

            Console.info('       ' + message);
        }

        const file = pthinkInternals.compositionOptions.relativeTo + '/' + pthinkInternals.developmentOptions.logfile;

        Fs.appendFile(file, message, (err) => {

            if (err) {
                throw err;
            }

            return;
        });
    }
};
