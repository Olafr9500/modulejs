/**
 * Permet d'afficher le chargement d'un element dans un bouton
 * @param {HTMLElement} selector Sélecteur du bouton
 * @param {string} text Texte à afficher
 * @param {boolean} tiny Afficher le text ou non
 * @param {string} type type de loading (grow ou border)
 * @param {string} size Taille des elements dans le bouton (sm ou lg ou null)
 */
function loadBtn(selector, text, tiny, type, size = null) {
    if (selector === null) throw new Error('Erreur Selector');
    type = ['grow', 'border'].includes(type) ? type : 'border';
    size = size != null ? ['sm', 'lg'].includes(size) ? size : 'sm' : null;
    selector.innerHTML = selector.disabled ? text == null ? 'OK' : text : '<span class="spinner-' + type + (size != null ? ' spinner-' + type + '-' + size + '' : '') + '" role="status" aria-hidden="true"></span>' + (tiny !== true ? ' ' + (text == null ? 'Chargement...' : text) : '');
    selector.disabled = !selector.disabled;
}

export default loadBtn;