const fs = require('fs');
const { minify } = require('terser');
// pour chaque fichier, on le minifie et on le stocke dans js avec le même nom + .min.js
fs.readdirSync('.').forEach(file => {
    if (file != 'rollup.config.js' && file != 'terser.js' && file != 'export.js' && file.endsWith('.js') && !file.endsWith('.min.js')) {
        fs.writeFileSync(`./${file.replace('.js', '.min.js')}`, minify(fs.readFileSync(`./${file}`, 'utf8'), { compress: true, mangle: true }).code);
        console.log(`${file} minify`);
    }
});