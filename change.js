/**
 * Script to put 1 line in index.cjs.js
 */
const fs = require('fs');
const line = 'Object.defineProperty(exports, \'__esModule\', { value: true });\n\nconst XMLHttpRequest = require(\'xmlhttprequest\').XMLHttpRequest;';
const file = 'index.cjs.js';


fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    const result = data.replace('Object.defineProperty(exports, \'__esModule\', { value: true });', line);
    fs.writeFile(file, result, 'utf8', function (err) {
        if (err) return console.log(err);
        console.log('Dependency injection done!');
    });
});