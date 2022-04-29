const rollupConfig = [{
    input: 'build/index.esm.js',
    output: {
        name: 'moduleJS',
        file: 'index.js',
        format: 'iife'
    }
},{
    input: 'build/index.esm.js',
    output: {
        name: 'moduleJS',
        file: 'index.esm.js',
        format: 'es'
    }
}];

module.exports = rollupConfig;