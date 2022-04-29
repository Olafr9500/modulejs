/**
 * Fonction retournant un HTMLElement via son id
 * @param {string} selector Id de l'élément
 * @returns {HTMLElement}
 */
function docId(selector) {
    return document.getElementById(selector);
}
/**
 * Fonction retournant un HTMLElement via une selection par querySelector
 * @param {string} selector Sélection de l'élément
 * @returns {HTMLElement}
 */
function docQ(selector) {
    return document.querySelector(selector);
}
/**
 * Fonction retournant plusieurs HTMLElement via une selection par querySelector
 * @param {string} selector Sélection de l'élément
 * @returns {HTMLElement}
 */
function docQAll(selector) {
    return document.querySelectorAll(selector);
}
/**
 * Fonction créant un élément HTML
 * @param {string} selector Element à créer
 * @returns {HTMLElement}
 */
function docCrea(selector) {
    return document.createElement(selector);
}

export { docId, docQ, docQAll, docCrea };