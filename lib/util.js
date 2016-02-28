'use strict';

// get next letter
let nextLetter = letter => {
    switch (letter) {
    case 'z': return 'A';
    case 'Z': return '_';
    case '_': return '$';
    case '$': return 'À';
    case 'Ö': return 'Ø';
    case 'ö': return 'ø';
    case '?':
        throw new Error('Not enough letters!');
        // In case you need more, look here: https://codepoints.net/search?IDS=1
    default:
        return String.fromCharCode(letter.charCodeAt(0) + 1);
    }
};

// get first free letter that is not contained in given list
let getFreeLetter = taken => {
    let result = 'a';
    while (taken.indexOf(result) > -1) {
        //console.log('trying', result);
        result = nextLetter(result);
    }
    //console.log('using', result);
    return result;
};

let assertIsogram = isogram => {
    if (!isogram) {
        throw new Error('Word must not be empty');
    }
    isogram.split('').sort().reduce((previous, current) => {
        if (current === previous) {
            throw new Error(`Word contains duplicate letter ${current}`);
        }
        return current;
    });
};


module.exports = {
    nextLetter,
    getFreeLetter,
    assertIsogram
};
