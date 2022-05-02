const rollupConfig = [{
    input: 'build/index.js',
    output: {
        name: 'moduleJS',
        file: 'index.js',
        format: 'iife'
    }
},{
    input: 'build/index.js',
    output: {
        name: 'moduleJS',
        file: 'index.esm.js',
        format: 'es'
    }
},{
    input: 'build/index.js',
    output: {
        name: 'moduleJS',
        file: 'index.cjs.js',
        format: 'cjs'
    }
}];

module.exports = rollupConfig;