'use strict';

const assert = require('assert');
const should = require('should');
const rename = require('../');

describe('isogram-param', function () {

    it('should do its job', function () {
        let input = `!function (foo, bar, baz, qux) { function t(e, foo) {e(); foo(); bar();} t(); a();}()`;
        let substituted = `!function(T,e,s,t){`;
        assert.ok(rename(input, 'Test').startsWith(substituted));
    });

});
