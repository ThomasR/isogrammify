#  isogrammify
[![npm version](https://img.shields.io/npm/v/isogrammify.svg)](https://www.npmjs.com/package/isogrammify)
[![Build Status](https://img.shields.io/travis/ThomasR/isogrammify.svg)](https://travis-ci.org/ThomasR/isogrammify)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/ThomasR/isogrammify.svg)](https://codeclimate.com/github/ThomasR/isogrammify/coverage)
[![Code Climate](https://img.shields.io/codeclimate/github/ThomasR/isogrammify.svg)](https://codeclimate.com/github/ThomasR/isogrammify/code)

Have you ever wanted to turn this

```javascript
!function(e,t,n,o,a,d,r,l,c,i,s,u,x){…
```

…into this?

```javascript
!function(t,r,o,u,b,l,e,m,a,k,i,n,g){…
```

Well, that is exactly what isogrammify does. You pass a function and a word, and iosgrammify renames the variables for you, such that the renamed parameters form that word.

## Usage in script

isogrammify takes three parameters,
 
* `program` (`String`|`Function`) The JS program to transform.
 Note that this must be a complete syntactically valid script. You cannot pass a simple anonymous function. That is a syntax error. You can pass a named function, because it forms a valid program by itself.
* `target` (`String`) The string that the variables should be replaced by. Must be an _**isogram**_, that is a word without duplicate letters
* `raw` (`Boolean`, optional) `true` to return an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) instead of a string. Defaults to `false`.

### Examples (scripting)

```javascript
var isogrammify = require('isogrammify');

var f = '!function(test){}()';
isogrammify(f, 'x');
//>     '!function(x){}()'

var f = '!function(x,y,z){}()';
isogrammify(f, 'Yay');
//>     '!function(Y,a,y){}()'

var f = function (x,y,z){};
isogrammify(f, 'Yay');
//> UnexpectedTokenError, since the function alone is not a valid program

var f = function f(x,y,z){};
isogrammify(f, 'abc');
//>     function f(a,b,c){}
```

## Usage from command line

There is also a command-line interface, where isogrammify takes three arguments

* `inputFile` The filename of the JS program to transform. The file must contain a valid JavaScript program as [descibed above](#usage-in-script).
* `isogram` The string that the variables should be replaced by. Must be an _**isogram**_, that is a word without duplicate letters
* `outputFile` (optional) A filename to write the output file to. Can be the same as `inputFile`. If omitted, the output is written to the console.

### Examples (CLI)
```plain
$ npm install isogrammify
…

$ isogrammify foo.js HelLo
!function(H,e,l,L,o){…

$ isogrammify foo.js HelLo bar.js
Wrote 4242 bytes to "bar.js".

```

## Does it accept unicode characters?

Oh yes, it does!

This tool was originally created as a part of [minislides](https://github.com/ThomasR/minislides), where I did this:

```javascript
var f = '!function(e,a,t,c,n,o,s,r,i,l,d,u,f,y,k,m){…';
isogrammify(f, 'ツminïslĩdeṣ_FTWǃ');
//>     '!function(ツ,m,i,n,ï,s,l,ĩ,d,e,ṣ,_,F,T,W,ǃ){…'
```

But later, I decided against using non-ASCII characters, since they take up more than one byte per letter.

Note that `ǃ` is a valid identifier, it is [not an exclamation mark](https://codepoints.net/U+01C3). Please use [Mathias Bynens’s variable name validator](https://mothereff.in/js-variables#%C7%83%E3%83%84%E1%80%91%C3%9F%E2%84%87%CF%84%E2%84%8F%E0%B8%81%E0%B9%87%E0%B9%87%E0%B9%87%E0%B9%87%E0%B9%87x%E2%83%97%C2%BA%E1%90%A9%E1%90%A8%E1%90%9F%E1%91%89%E1%90%A6%E1%90%B8%E1%90%B3%E3%85%A1%E3%85%A3%E1%83%9A_%E0%B2%A0%E7%9B%8A%E0%B2%A0_%E1%83%9A) to find valid characters, or [browse the complete list](https://codepoints.net/search?IDS=1).

## Why can’t I simply search & replace instead?

Because the function body may contain identifiers with conflicting names. Even if you make sure that only the given variable is renamed, you may run into trouble because of inner functions with overlapping variable scopes.

For example, if you want to rename this function’s parameters to `T,e,s,t`:

```javascript
!function (foo, bar, baz, qux) { function t(e, foo) {e(); foo(); bar();} t(); a();}()
```
…you may destroy the inner `bar()` call when you try to rename `bar` to `e`. That is because the inner function establishes a new scope for `e`.

```javascript
!function (T, e, s, t) { function t(e, foo) {e(); foo(); e();} t(); a();}()
// broken!                                               ^
```

So you’ll need to rename that `e` to something else first, and so on.

```javascript
!function (T, e, s, t) { function t(something, foo) {something(); foo(); e();} t(); a();}()
```

[![License: Apache 2.0](https://img.shields.io/github/license/ThomasR/isogrammify.svg)](LICENSE)
