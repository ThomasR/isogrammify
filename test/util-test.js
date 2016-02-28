'use strict';

const assert = require('assert');
const util = require('../lib/util');

describe('util', () => {

    describe('nextLetter', () => {
        it('should give the next valid identifier letter', () => {
            let fixtures = [
                ['a', 'b'],
                ['z', 'A'],
                ['A', 'B'],
                ['Z', '_'],
                ['_', '$'],
                ['$', 'À'],
                ['À', 'Á'],
                ['Ö', 'Ø'],
                ['ö', 'ø'],
                ['Ķ', 'ķ']
            ];
            fixtures.forEach(x => assert.equal(util.nextLetter(x[0]), x[1]));
        });
        it('should throw when reaching "ˁ"', () => {
            assert.throws(util.nextLetter.bind(util, 'ˁ'), Error);
        });
    });

    describe('getFreeLetter', () => {
        it('should get a free letter', () => {
            assert.equal(util.getFreeLetter([]), 'a');
            assert.equal(util.getFreeLetter(['a', 'b', 'c']), 'd');
            assert.equal(util.getFreeLetter(['a', 'X', 'c']), 'b');
        });
    });

    describe('assertIsogram', () => {
        it('should reject the empty string', () => {
            assert.throws(util.assertIsogram.bind(util, ''), Error);
        });

        it('should reject non-isogrammic strings', () => {
            let fixtures = ['foo', 'xx', 'test', 'bananapancake'];
            fixtures.forEach(word => assert.throws(util.assertIsogram.bind(util, word), Error));
        });

        it('should allow isogrammic strings', () => {
            let fixtures = ['isogram', 'x', 'Test', 'dermatoglyphics', 'Heizölrückstoßabdämpfung'];
            fixtures.forEach(word => assert.doesNotThrow(util.assertIsogram.bind(util, word), Error));
        });
    });
});
