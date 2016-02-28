/*!
* Copyright 2016 Thomas Rosenau
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const escope = require('escope');

const util = require('./lib/util');

/**
* Variable name replacer:
*   function(e,t,n,o,a,d,l,c,i,s,u){
* ->
*   function(I,s,o,g,r,a,m,M,i,f,y){
*
* @param {string|Function} input The program to be mangled
* @param {string} target The isogram that should be used to rename the parameters
* @param {boolean} raw `true` to return an AST instead of a string. Defaults to `false`j
* @returns {string|object} The mangled function as a string, or as an AST, depending on the `raw` argument.
*/
module.exports = (input, target, raw) => {
    util.assertIsogram(target);

    // create syntax tree and scope analysis
    let ast = esprima.parse(input);
    var scopes = escope.analyze(ast).scopes;

    // Determine global identifiers.
    let globalNames = scopes.filter(scope => scope.implicit && scope.implicit.left).reduce((result, scope) => {
        let found = scope.implicit.left.map(global => global.identifier.name);
        return result.concat(found);
    }, []);
    globalNames.forEach(global => {
        if (global.length === 1 && target.indexOf(global) > -1) {
            // This is too dangerous
            throw new Error(`Cannot replace global variable "${global}"`);
        }
    });

    // get local variables (AST nodes)
    let locals = scopes.reduce((result, scope) => {
        return result.concat(scope.variables.filter(v => v.name !== 'arguments').filter(v => {
            // filter global function names
            for (let ref of v.defs) {
                if (ref.type === 'FunctionName' && v.scope.type === 'global') {
                    return false;
                }
            }
            return true;
        }));
    }, []);

    // replace a node's variable name by the given letter
    // Also replace all occurrences of the same variable in the whole tree
    let replaceName = (variable, letter) => {
        if (variable.name === letter) {
            return;
        }
        //console.log(`replacing ${variable.name} -> ${letter}`);
        let ids = variable.references.map(r => r.identifier).concat(variable.identifiers).concat([variable]);
        ids.forEach(id => id.name = letter);
    };

    // carry out the replacement
    let targetLetters = target.split('');
    targetLetters.forEach((letter, i) => {
        let candidate = locals[i];
        if (!candidate) {
            throw new Error('Not enough variables to replace');
        }
        replaceName(candidate, letter);
        // replace conflicting locals
        let taken = locals.map(l => l.name).concat(globalNames).concat(targetLetters);
        let freeLetter = util.getFreeLetter(taken);
        locals.forEach(local => {
            if (local !== candidate && local.name === letter) {
                replaceName(local, freeLetter);
            }
        });
    });

    if (raw) {
        return ast;
    }

    // serialize result
    return escodegen.generate(ast, {
        format: {
            compact: true,
            quotes: 'double',
            semicolons: false
        }
    });
};
