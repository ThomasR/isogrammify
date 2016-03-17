'use strict';

const assert = require('assert');
const fs = require('fs');
const mktemp = require('mktemp');
const path = require('path');
const proc = require('child_process');
const rimraf = require('rimraf');

let projectDir = path.resolve(__dirname, '..');

let runSync = function (cmd/*, ...args */) { // dot-notation not yet supported by node
    let args = Array.prototype.slice.call(arguments, 1);
    return proc.spawnSync(cmd, args, {
        cwd: projectDir,
        encoding: 'utf-8'
    });
};

let assertNoFile = filename => assert.throws(() => fs.readFileSync(filename), /ENOENT/);

let binary;

describe('isogrammify CLI', () => {

    let tmpDir, tmpInput, tmpOutput, tmpInputInvalid;
    let code = '!function(a,b,c,d){}';
    let isogram = 'Test';
    let expected = '!function(T,e,s,t){}';

    before(() => {
        tmpDir = mktemp.createDirSync('XXXXX~.tmp');
        tmpInput = path.resolve(tmpDir, 'in.js');
        fs.writeFileSync(tmpInput, code, 'utf-8');
        tmpInputInvalid = path.resolve(tmpDir, 'invalid.js');
        fs.writeFileSync(tmpInputInvalid, '%!#@', 'utf-8');
        tmpOutput = path.resolve(tmpDir, 'out.js');
    });
    after(() => {
        rimraf.sync(tmpDir);
    });
    afterEach(() => {
        try {
            fs.unlinkSync(tmpOutput);
        } catch (ignoreENOENT) {}
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

    it('throws an Error on not enough arguments', () => {
        it('zero', () => {
            let ret = runSync('node', binary);
            assert.notEqual(ret.stderr, '');
            assert.notEqual(ret.status, 0);
        });
        it('one', () => {
            let ret = runSync('node', binary, tmpInput);
            assert.notEqual(ret.stderr, '');
            assert.notEqual(ret.status, 0);
        });
    });

    it('writes to stdout when called with two arguments', () => {
        let ret = runSync('node', binary, tmpInput, isogram);
        assert.equal(ret.stderr, '');
        assert.equal(ret.status, 0);
        assert.equal(ret.stdout, expected);
    });

    it('writes to file when called with three arguments', () => {
        let ret = runSync('node', binary, tmpInput, isogram, tmpOutput);
        assert.equal(ret.stderr, '');
        assert.equal(ret.status, 0);
        assert.equal(fs.readFileSync(tmpOutput, 'utf-8'), expected);
    });

    it('throws an Error on too many arguments', () => {
        it('four', () => {
            let ret = runSync('node', binary, tmpInput, isogram, tmpOutput, 'foo');
            assert.notEqual(ret.stderr, '');
            assert.notEqual(ret.status, 0);
            assertNoFile(tmpOutput);

        });
        it('six', () => {
            let ret = runSync('node', binary, tmpInput, isogram, tmpOutput, 'foo', 'bar', 'baz');
            assert.notEqual(ret.stderr, '');
            assert.notEqual(ret.status, 0);
            assertNoFile(tmpOutput);
        });
    });

    it('throws an error when input file does not exist', () => {
        let ret = runSync('node', binary, tmpOutput, isogram, tmpOutput);
        assert.notEqual(ret.stderr, '');
        assert.notEqual(ret.status, 0);
        assertNoFile(tmpOutput);
    });

    it('throws an error when input file does not contain valid code', () => {
        let ret = runSync('node', binary, tmpInputInvalid, isogram, tmpOutput);
        assert.notEqual(ret.stderr, '');
        assert.notEqual(ret.status, 0);
        assertNoFile(tmpOutput);
    });
});
