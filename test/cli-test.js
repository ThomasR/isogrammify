'use strict';

const assert = require('assert');
const process = require('child_process');
const fs = require('fs');
const path = require('path');
const mktemp = require('mktemp');
const rimraf = require('rimraf');

let projectDir = path.resolve(__dirname, '..');

let runSync = function (cmd/*, ...args */) { // dot-notation not yet supported by node
    let args = Array.prototype.slice.call(arguments, 1);
    return process.spawnSync(cmd, args, {encoding: 'utf-8'});
};

let binary;

describe('isogrammify CLI', () => {

    let tmpDir, tmpInput, tmpOutput;
    before(() => {
        tmpDir = mktemp.createDirSync('XXXXX~.tmp');
        tmpInput = path.resolve(tmpDir, 'in.js');
        tmpOutput = path.resolve(tmpDir, 'out.js');
    });
    after(() => {
        rimraf.sync(tmpDir);
    });

    it('is defined in package.json', () => {
        let jsonFile = path.resolve(projectDir, 'package.json');
        binary = JSON.parse(fs.readFileSync(jsonFile, 'utf-8')).bin;
    });

    it('is present in filesystem', () => {
        binary = path.resolve(projectDir, binary);
        if (!fs.existsSync(binary)) {
            throw new Error('Binary not found');
        }
    });

    it('should throw an Error on not enough arguments', () => {
        let ret = runSync('node', binary);
        assert.notEqual(ret.stderr, '');
        assert.notEqual(ret.status, 0);
    });

    /* TODO: implement
    it('should throw an Error on not enough arguments', () => {
        fs.writeFileSync(tmpInput,
        let ret = runSync('node', binary, tmpInput, 'bar', tmpOutput);
        assert.notEqual(ret.stderr, '');
        assert.notEqual(ret.status, 0);
    });
    */

});
