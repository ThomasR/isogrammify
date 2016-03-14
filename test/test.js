'use strict';

const assert = require('assert');
const rename = require('../lib/isogrammify');

describe('isogrammify', () => {

    it('should process IEFEs', () => {
        let input = `!function (foo, bar, baz, qux) { function t(e, foo) {e(); foo(); bar();} t(); a();}()`;

        let expected = `!function(T,e,s,t){`;
        assert.equal(rename(input, 'Test').substr(0, expected.length), expected);

        let ast = rename(input, 'Test', true);
        let f = ast.body[0].expression.argument.callee;
        assert.equal(f.params[0].name, 'T');
        assert.equal(f.params[1].name, 'e');
        assert.equal(f.params[2].name, 's');
        assert.equal(f.params[3].name, 't');

        let t = f.body.body[0];
        assert.notEqual(t.params[0].name, 'e');
        assert.equal(t.params[1].name, 'foo');
    });

    it('should do nothing when renaming to an already given value', () => {
        let input = `!function(T,e,s,t){}`;
        assert.equal(rename(input, 'Test'), input);
    });

    it('should process named functions', () => {
        let input = function f(foo, bar, baz, qux) { function t(e, foo) {e(); foo(); bar();} t(); a();};
        let expected = `function f(T,e,s,t){`;
        assert.equal(rename(input, 'Test').substr(0, expected.length), expected);
    });

    it('should throw an Error if there are not enough parameters', () => {
        let input = `function a(b){}`;
        assert.throws(rename.bind(null, input, 'verylong'), Error);
    });

    it('should throw an Error if second argument is not an isogram', () => {
        let input = `!function (a, b, c){}()`;
        assert.throws(rename.bind(null, input, 'foo'), Error);
    });

    it('should throw an error on conflicting implied globals', () => {
        let input = `!(function(a, b) { x(); })();`;
        assert.throws(rename.bind(null, input, 'xy'), Error);

        input = `function x(a, b) { x(); }`;
        assert.throws(rename.bind(null, input, 'xy'), Error);
    });

    it('should accept a third argument', () => {
        let input = 'function f(a) {}';
        let result = rename(input, 'x', true);
        assert.equal(typeof result, 'object');
    });

});
