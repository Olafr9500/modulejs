'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

/**
 * List des requêtes en cours
 */
const xhrPool = [];
/**
 * Annule l'ensemble des requêtes HTTP en cours
 */
function abortAllRequest() {
    xhrPool.forEach(element => {
        element.abort();
    });
    xhrPool.length = 0;
}

/**
 * Fonction d'affichage des alerts
 * @param {string} selector Nom de l'environnement ou afficher l'alert.
 * @param {string} type "warning" ou "danger".
 * @param {string} message Message afficher dans l'alert.
 * @param {boolean} autoClear Effacer les alerts déjà existantes.
 */
function displayAlert(selector, type, message, autoClear = true) {
    const typeAlert = {
        info: {
            className: 'alert-info',
            icon: 'bi-info-circle'
        },
        success: {
            className: 'alert-success',
            icon: 'bi-patch-check'
        },
        warning: {
            className: 'alert-warning',
            icon: 'bi-exclamation-triangle'
        },
        danger: {
            className: 'alert-danger',
            icon: 'bi-x-octagon'
        }
    };
    // if the script is called in browser
    if (typeof document !== 'undefined') {
        if (document.querySelector(selector) == null) {
            throw new Error('Element absence de la page');
        } else {
            document.querySelectorAll(selector + ' div.alert').forEach(element => {
                if (autoClear) {
                    element.remove();
                }
            });
            const alert = document.createElement('div');
            alert.classList.add('alert', 'alert-dismissible', 'fade', 'show', typeAlert[type].className);
            alert.innerHTML = '<i class="bi ' + typeAlert[type].icon + '"></i> ' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
            document.querySelector(selector).prepend(alert);
        }
    } else {
        switch (type) {
        case 'info':
            console.log('%c' + message, 'color: #0099ff; font-weight: bold;');
            break;
        case 'success':
            console.log('%c' + message, 'color: #00cc00; font-weight: bold;');
            break;
        case 'warning':
            console.warn(message);
            break;
        case 'danger':
            console.error(message);
            break;
        default:
            console.log(message);
            break;
        }
    }
}

/**
* Réponse par défaut en cas d'échec de l'appel API
*/
const DEFAULT_RESPONSE = 'Erreur lors de l\'appel de l\'API';
/**
 * List des méthodes HTTP autorisées
 */
const LIST_METHOD = ['GET', 'POST'];
/**
 * Appel l'API pour réaliser une action dans la base de données
 * @param {string} method HTTP request method : GET/POST
 * @param {string} url Adresse URL de l'API
 * @param {Object} data Information à envoyer
 * @param {string} token Clé d'identification à l'API
 * @param {function} callbackSuccess Fonction de retour en cas de success de l'appel API et d'aucun message d'erreur
 * @param {function} callbackFail Fonction de retour en cas de success de l'appel API et avec des messages d'erreurs
 * @param {function} callbackError Fonction de retour en cas d'échec de l'appel API
 * @param {function} callbackAlways Fonction de retour en cas d'appel API
 * @param {boolean} sync true, l'appel API est asynchrone.
 */
function callAPI(method, url, data = null, token = null, callbackSuccess = null, callbackFail = null, callbackError = null, callbackAlways = null, sync = true) {
    if (LIST_METHOD.includes(method)) {
        const xhr = new XMLHttpRequest();
        xhrPool.push(xhr);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    if (this.responseText !== '') {
                        if (this.responseText.indexOf('{') !== -1) {
                            const response = JSON.parse(this.responseText);
                            if (response.error) {
                                if (response.error === 'no') {
                                    if (callbackSuccess) {
                                        callbackSuccess(response);
                                    } else {
                                        displayAlert('main', 'success', 'Appel Réussi');
                                    }
                                } else {
                                    if (callbackFail) {
                                        callbackFail(response);
                                    } else {
                                        displayAlert('main', 'warning', response.error);
                                    }
                                }
                            } else {
                                if (callbackSuccess) {
                                    callbackSuccess(response);
                                } else {
                                    displayAlert('main', 'warning', 'Appel Réussi mais mauvais format');
                                }
                            }
                        } else {
                            if (callbackError) {
                                callbackError({ error: 'Réponse au mauvais format' });
                            } else {
                                displayAlert('main', 'danger', 'Réponse au mauvais format');
                            }
                        }
                    } else {
                        if (callbackError) {
                            callbackError({ error: 'Aucune réponse de la part du serveur malgré un code 200' });
                        } else {
                            displayAlert('main', 'danger', 'Aucune réponse de la part du serveur malgré un code 200');
                        }
                    }
                } else {
                    if (callbackError) {
                        callbackError({error: 'Status HTTP ' + this.status});
                    } else {
                        displayAlert('main', 'danger', 'Status HTTP ' + this.status);
                    }
                }
                if (callbackAlways) {
                    callbackAlways();
                }
            }
        };
        xhr.open(method, url + (data != null && method === 'GET' ? '?' + (data instanceof FormData ? new URLSearchParams(data).toString() : transformRequest(data)) : ''), sync);
        if (token != null) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send((data != null && method === 'POST' ? (data instanceof FormData ? new URLSearchParams(data).toString() : transformRequest(data)) : ''));
    } else {
        throw new Error('Méthode inconnue. Méthode autorisé : ' + LIST_METHOD.toString());
    }
    /**
       * Transforme les informations pour qu'elles soient compatible avec une requête API
       * @param {Object} obj Information à transformer
       * @returns {string|[]} Information compatible pour request API
       */
    function transformRequest(obj) {
        const str = [];
        for (const p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        return str.join('&');
    }
}

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

/**
 * Object cookie pour manager les cookie du navigateur
 */
class cookie {
    /**
       * Créer un cookie
       * @param {string} name Nom du cookie
       * @param {string} value Valeur du cookie
       * @param {int} expirationDays Nombre de jours de vie du cookie
       * @returns {boolean} True si le cookie a été créé
       */
    static set(name, value, expirationDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/;SameSite=Strict';
        return true;
    }

    /**
       * Cherche un cookie existant en fonction de son nom
       * @param {string} inputCookie Nom du cookie à chercher
       * @returns {string | boolean} Valeur du cookie si trouvé
       */
    static get(inputCookie = null) {
        let returnValue = false,
            cookieList = document.cookie.split(';');
        if (inputCookie === null) return false;
        cookieList.forEach(cookie => {
            cookie = { 'name': cookie.trim().split('=')[0], 'value': cookie.trim().split('=')[1] };
            if (cookie.name === inputCookie) {
                returnValue = cookie.value;
            }
        });
        return returnValue;
    }

    /**
       * Supprime un cookie existant en fonction de son nom
       * @param {string} name Nom du cookie à supprimer
       * @returns {boolean} True si le cookie a été supprimé
       */
    static delete(name) {
        if (this.get(name) !== false) {
            document.cookie = name + '=' + ';path=/;SameSite=Strict;expires=Thu, 01 Jan 1970 00:00:01 GMT';
            return true;
        }
    }
}

/**
 * Object search pour les recherche dans des éléments typique de HTML
 */
class search {
    /**
       * Recherche un terme dans une cologne d'un tableau
       * @param {string} idTable Nom du tableau dans lequel chercher
       * @param {int} index Numéro de la cologne dans laquelle chercher
       * @param {string} input Terme rechercher
       * @param {string} typeSearch Type de recherche
       */
    static table(idTable, index, input = '', typeSearch = 'LIKE') {
        if (typeof idTable === 'string') {
            const table = document.getElementById(idTable);
            const rows = table.querySelector('tbody').rows;
            for (const element of rows) {
                switch (typeSearch) {
                case 'LIKE':
                    if (element.querySelectorAll('td')[index].innerHTML.includes(input)) {
                        if (!element.classList.contains('mustBeMask')) {
                            element.classList.remove('d-none');
                        }
                    } else {
                        element.classList.add('d-none');
                    }
                    break;
                case 'EQUAL':
                    if (element.querySelectorAll('td')[index].innerHTML === input) {
                        if (!element.classList.contains('mustBeMask')) {
                            element.classList.remove('d-none');
                        }
                    } else {
                        element.classList.add('d-none');
                    }
                    break;
                }
            }
        }
    }

    /**
       * Recherche un terme dans une array
       * @param {array} array Array dans lequel chercher
       * @param {int} index Index de l'array dans lequel chercher
       * @param {string} input Terme rechercher
       * @param {string} typeSearch Type de recherche
       * @returns {array}
       */
    static array(array, index, input = '', typeSearch = 'LIKE') {
        let foundArray = [];
        if (typeof array === 'object' && array.length > 0) {
            array.forEach(element => {
                if (element[index]) {
                    switch (typeSearch) {
                    case 'LIKE':
                        if (element[index].includes(input)) {
                            foundArray.push(element);
                        }
                        break;
                    case 'EQUAL':
                        if (element[index] === input) {
                            foundArray.push(element);
                        }
                    }
                } else {
                    foundArray = [];
                }
            });
        }
        return foundArray;
    }
}

/**
 * Object sort pour trier des éléments typique de HTML
 */
class sort {
    /**
       * Fonction de trié des tableau dans l'order croissant et décroissant
       * @param {int} column Numéro de la colonne à trié
       * @param {string} table Id du tableau à trié
       */
    static table(column, table) {
        let rows; let switching; let i; let shouldSwitch; let dir; let switchCount = 0;
        let current; let next;
        table = document.getElementById(table);
        switching = true;
        dir = 'asc';
        while (switching) {
            switching = false;
            rows = table.querySelector('tbody').rows;
            if (rows.length) {
                for (i = 0; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
                    current = rows[i].querySelectorAll('td')[column].innerHTML;
                    next = rows[i + 1].querySelectorAll('td')[column].innerHTML;
                    current = (isNaN(current) ? (current.includes('%') || current.includes('€') ? parseFloat(current.split(/( )|(&nbsp;)/)[0]) : current) : parseFloat(current));
                    next = (isNaN(next) ? (next.includes('%') || next.includes('€') ? parseFloat(next.split(/( )|(&nbsp;)/)[0]) : next) : parseFloat(next));
                    if (dir === 'asc') {
                        if (current > next) {
                            shouldSwitch = true;
                            break;
                        }
                    } else {
                        if (current < next) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
                if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    switchCount++;
                } else {
                    if (switchCount === 0 && dir === 'asc') {
                        dir = 'desc';
                        switching = true;
                    }
                }
            }
        }
    }
}

class json {
    static read(file, callback) {
        let rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType('application/json');
        rawFile.open('GET', file, true);
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4 && rawFile.status == '200') {
                callback(rawFile.responseText);
            }
        };
        rawFile.send(null);
    }
}

exports.DEFAULT_RESPONSE = DEFAULT_RESPONSE;
exports.LIST_METHOD = LIST_METHOD;
exports.abortAllRequest = abortAllRequest;
exports.callAPI = callAPI;
exports.cookie = cookie;
exports.displayAlert = displayAlert;
exports.docCrea = docCrea;
exports.docId = docId;
exports.docQ = docQ;
exports.docQAll = docQAll;
exports.json = json;
exports.loadBtn = loadBtn;
exports.search = search;
exports.sort = sort;
exports.xhrPool = xhrPool;
