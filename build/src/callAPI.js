import displayAlert from './displayAlert';
import { xhrPool } from './abortAllRequest';
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

export default callAPI;
export { DEFAULT_RESPONSE, LIST_METHOD };