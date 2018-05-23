'use strict';

const CircuitB = require('../');
const hostile = require('hostile');
const http = require('http');
const tap = require('tap');

const mockServer = () => {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK');
        }).listen(() => {
            resolve(server);
        });
    });
};

const request = (address) => {
    return new Promise((resolve, reject) => {
        http.get(address, (res) => {
            if (res.statusCode !== 200) {
                resolve(null);
            }

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (error) => {
            console.log('error', error);
            resolve(error);
        });
    });
};



tap.test('setup', (t) => {
    hostile.set('127.0.0.1', 'circuit-b.local', (error) => {
        if (error) {
            throw error;
        }
        t.end();
    });
});


/**
 * Constructor
 */

tap.test('CircuitB() - object type - should be CircuitB', (t) => {
    const cb = new CircuitB();
    t.equal(Object.prototype.toString.call(cb), '[object CircuitB]');
    t.end();
});


tap.test('CircuitB() - foo - bar', async (t) => {
    const cb = new CircuitB();
    const server = await mockServer();
    const address = server.address();

    cb.enable();

//    const data = await request(address);
    console.log('a');

    // cb.disable();


//    const d = await request(address);
    console.log('b');

    const e = await request(`http://circuit-b.local:${address.port}`);
    console.log('e', e);


    server.close(() => {
        t.end();
    });

    //    t.equal(Object.prototype.toString.call(cb), '[object CircuitB]');
});

tap.test('teardown', (t) => {
    hostile.remove('127.0.0.1', 'circuit-b.local', (error) => {
        if (error) {
            throw error;
        }
        t.end();
    });
});