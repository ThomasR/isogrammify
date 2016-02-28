#  isogram-param
[![npm version](https://img.shields.io/npm/v/isogram-param.svg)](https://www.npmjs.com/package/isogram-param)
[![Build Status](https://img.shields.io/travis/ThomasR/isogram-param.svg)](https://travis-ci.org/ThomasR/isogram-param)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/ThomasR/isogram-param.svg)](https://codeclimate.com/github/ThomasR/isogram-param/coverage)
[![Code Climate](https://img.shields.io/codeclimate/github/ThomasR/isogram-param.svg)](https://codeclimate.com/github/ThomasR/isogram-param/code)

Have you ever wanted to turn this

```javascript
!function(e,t,n,o,a,d,r,l,c,i,s,u,x){…
```

…into this?

```javascript
!function(t,r,o,u,b,l,e,m,a,k,i,n,g){…
```

Well, that is exactly what isogram-param does. You pass a function and a word, and iosgram-param renames the variables for you, such that the renamed parameters form that word.

## Usage

isogram-param takes three parameters,
 
* `program` (`String`|`Function`) The JS program to transform.
 Note that this must be a complete syntactically valid script. You cannot pass a simple anonymous function. That is a syntax error. You can pass a named function, because it forms a valid program by itself.
* `target` (`String`) The string that the variables should be replaced by. Must be an _**isogram**_, that is a word without duplicate letters
* `raw` (`Boolean`, optional) `true` to return an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) instead of a string. Defaults to `false`.

### Examples

```javascript
var rename = require('isogram-param');

var f = '!function(test){}()';
rename(f, 'x');
//>     '!function(x){}()'

var f = '!function(x,y,z){}()';
rename(f, 'Yay');
//>     '!function(Y,a,y){}()'

var f = function (x,y,z){};
rename(f, 'Yay');
//> UnexpectedTokenError, since the function alone is not a valid program

var f = function f(x,y,z){};
rename(f, 'abc');
//>     function f(a,b,c){}
```

## Why can’t I simply search & replace instead?

Because the function may contain identifiers with conflicting names. Even if you make sure that only the given variable is renamed, you may run into trouble because of inner functions with overlapping variable scopes.

For example, if you want to rename this function’s parameters to `T,e,s,t`:

```javascript
!function (foo, bar, baz, qux) { function t(e, foo) {e(); foo(); bar();} t(); a();}()
```
you may destroy the inner `bar()` call when you try to rename `bar` to `e`. That is because the inner function establishes a new scope for `e`. So you’ll need to rename that `e` first, which poses the same problem again.

[![](https://img.shields.io/github/license/ThomasR/isogram-param.svg)](LICENSE)
