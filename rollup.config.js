const rollupConfig = [{
    input: 'build/index.js',
    output: [{
        name: 'moduleJS',
        file: 'moduleJS.js',
        format: 'iife'
    }, {
        name: 'moduleJS',
        file: 'index.esm.js',
        format: 'es'
    }, {
        name: 'moduleJS',
        file: 'index.cjs.js',
        format: 'cjs'
    }]
}];

module.exports = rollupConfig;