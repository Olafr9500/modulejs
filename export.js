/**
 * Permet de copier les fichiers 'index.js' et index.min.js dans le dossier voulu par l'utilisateur avec les nom 'modulejs.js' et 'modulejs.min.js'
 * @param {string} path - Chemin du dossier où seront copiés les fichiers
 */
const fs = require('fs');
const files = ['index.js', 'index.min.js'];
const path = process.argv[2];
if (path) {
    fs.mkdirSync('temp', { recursive: true });
    files.forEach(file => {
        fs.copyFileSync(file, `temp/${file}`);
        // renommer les fichiers index.js et index.min.js en modulejs.js et modulejs.min.js
        fs.renameSync(`temp/${file}`, `temp/${file.replace(/index/, 'modulejs')}`);
        fs.copyFileSync(`temp/${file.replace(/index/, 'modulejs')}`, `${path}/${file.replace(/index/, 'modulejs')}`);
        console.log(`${file} copied`);
    });
    fs.rmSync('temp', { recursive: true });
} else {
    console.log('Veuillez indiquer le chemin du dossier où seront copiés les fichiers');
}

