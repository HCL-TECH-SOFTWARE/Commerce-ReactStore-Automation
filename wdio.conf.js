/*
# Copyright 2021 HCL America, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# The script sets up necessary environment variables to run DX in a docker-compose environment
*/
var fs = require('fs');
var moment = require('moment');
var envConfig = require('./env.config.json');
var timestamp = moment().format('YYYY-MM-DD HHmmss.SSS');
var baseUrl = envConfig.servers[2].schema + '://' + envConfig.servers[2].hostName + ':' + envConfig.servers[2].portNumber;

exports.config = {

    runner: 'local',
    specs: [
        './test/e2e/tests/CreateB2BUser.ts',
        './test/e2e/tests/b2b/*.ts',
        './test/e2e/tests/b2c/*.ts',
        './test/e2e/tests/DeleteUser.ts'
    ],

    exclude: [
        // 'path/to/excluded/files'
    ],

    maxInstances: 10,

    capabilities: [{

        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu', '--start-maximized', "--window-size=1920,1080", "--no-sandbox"],
        },
        acceptInsecureCerts: true,
        excludeDriverLogs: ['*'],
    }],

    sync: true,
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    loglevel: 'debug',
    outputDir: './output/wdio-logs/',
    bail: 0,
    baseUrl: baseUrl,
    waitforTimeout: 120000,
    waitforInterval: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'jasmine',
    reporters: ['spec', ['junit', {
            outputDir: 'build/test-results/testGroup/',
            outputFileFormat: function(options) {
                return `junit-report-${options.cid}.xml`
            }
        }],
        ['allure', {
            outputDir: 'output/reports/allure-results'
        }]
    ],

    jasmineOpts: {
        //requires: ['ts-node/register'],
        requires:  ['tsconfig-paths/register'],
        defaultTimeoutInterval: 500000,
        expectationResultHandler: function(passed, assertion) {
            if (passed) {
                return
            }
        }
    },

    beforeTest: function() {
        browser.maximizeWindow();
        browser.setTimeout({
            'implicit': 8000,
            'pageLoad': 150000
        })
    },

    afterTest: function(test, context, passed) {
        // if test passed, ignore, else take and save screenshot.
        if (passed.passed) {
            return;
        } else {
            const dir = './output/screenshots';
            fs.mkdir(dir, { recursive: true }, (err) => {
                if (err) { throw err; }
            });
            const path = require('path');
            const screenshotName = test.description + '_' + timestamp;
            const filepath = path.join('./output/screenshots/', screenshotName + '.png');
            browser.saveScreenshot(filepath);
            process.emit('test:screenshot', filepath);
            browser.takeScreenshot();
        }
    },
}