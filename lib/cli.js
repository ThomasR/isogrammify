#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const isogrammify = require('./isogrammify');

var args = Array.prototype.slice.call(process.argv, 2);
let inputFile, isogram;
let outputFile = null;
switch (args.length) {
case 3:
    outputFile = path.resolve(process.cwd(), args[2]);
    // fall-through
case 2:
    isogram = args[1];
    inputFile = path.resolve(process.cwd(), args[0]);
    break;
case 0:
    console.error('ERROR: Missing filename. Usage:\n\n  isogrammify INPUTFILE.js ISOGRAM [OUTPUTFILE.js]\n');
    process.exit(1);
    break;
case 1:
    console.error('ERROR: Missing isogram. Usage:\n\n  isogrammify INPUTFILE.js ISOGRAM [OUTPUTFILE.js]\n');
    process.exit(1);
    break;
default:
    console.error('ERROR: Too many arguments. Usage:\n\n  isogrammify INPUTFILE.js ISOGRAM [OUTPUTFILE.js]\n');
    process.exit(1);
    break;
}

let src, isogrammed;
try {
    src = fs.readFileSync(inputFile);
} catch (e) {
    console.error(`ERROR: Could not open "${inputFile}"`);
    process.exit(2);
}
try {
    isogrammed = isogrammify(src, isogram, false);
} catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exit(3);
}
if (outputFile) {
    try {
        fs.writeFileSync(outputFile, isogrammed, 'utf-8');
        console.info(`Wrote ${isogrammed.length} bytes to "${outputFile}".`);
        process.exit(0);
    } catch (e) {
        console.error(`ERROR: Could not write to file "${outputFile}"`);
        process.exit(2);
    }
} else {
    process.stdout.write(isogrammed);
}
