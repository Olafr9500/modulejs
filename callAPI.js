const urlAPIDistante = "<TODO Set url>",
    LIST_METHOD = ["GET", "POST"],
    DEFAULT_REPONSE = "Erreur lors de l'appel de l'API";
var xhrPool = [];
/**
 * Appel l'API pour réaliser une action dans la base de données
 * @param {string} method HTTP request method : GET/POST
 * @param {string} url Adresse URL de l'API
 * @param {Object} data Information à envoyer
 * @param {string} token Clé d'identification à l'API
 * @param {Function} callbackSuccess Fonction de retour en cas de success de l'appel API et d'aucun message d'erreur
 * @param {Function} callbackFail Fonction de retour en cas de success de l'appel API et avec des messages d'erreurs
 * @param {Function} callbackError Fonction de retour en cas d'échec de l'appel API
 * @param {Function} callbackAlways Fonction de retour en cas d'appel API
 * @param {boolean} sync true, l'appel API est asynchrone.
 */
function callAPI(method, url, data = null, token = null, callbackSuccess = null, callbackFail = null, callbackError = null, callbackAlways = null, sync = true) {
    if (typeof displayAlert !== "function") {
        displayAlert = (selector, type, message) => {
            console.error("Function displayAlert non-charger", selector, type, message);
            alert(message);
        }
    }
    if (LIST_METHOD.includes(method)) {
        let xhttp = new XMLHttpRequest();
        xhrPool.push(xhttp);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if (isExternalURL(url)) {
                        callbackSuccess ? callbackSuccess(response) : displayAlert("main", "success", "Appel Réussi");
                    } else {
                        if (response.error == "no") {
                            callbackSuccess ? callbackSuccess(response) : displayAlert("main", "success", "Appel Réussi");
                        } else {
                            callbackFail ? callbackFail(response) : displayAlert("main", "warning", response.error);
                        }
                    }
                } else {
                    callbackError ? callbackError() : displayAlert("main", "danger", "Erreur lors de l'appel de l'API");
                }
                if (isExternalURL(url)) {
                    callbackFail ? callbackFail(response) : displayAlert("main", "warning", response.error);
                } else {
                    callbackAlways ? callbackAlways() : null;
                }
            }
        };
        xhttp.open(method, url + (data != null && method == "GET" ? "?" + (data instanceof FormData ? new URLSearchParams(data).toString() : transformRequest(data)) : ""), sync);
        if (token != null) {
            xhttp.setRequestHeader('Authorization', 'Bearer ' + token);
        }
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.send((data != null && method == "POST" ? (data instanceof FormData ? new URLSearchParams(data).toString() : transformRequest(data)) : ""));
    } else {
        throw "Methode inconnue. Methode authorisé : " + LIST_METHOD.toString();
    }
    /**
     * Transforme les informations pour qu'elles soient compatible avec une requête API
     * @param {Object} obj Information à transformer
     * @returns {string|[]} Information compatible pour request API
     */
    function transformRequest(obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    }
    /**
     * Vérifie si une URL donné est bien externe au site courant.
     * @param {string} url url à vérifier
     * @returns true si elle est externe a window.location.host
     */
    function isExternalURL(url) {
        let a = document.createElement('a');
        a.href = url;
        return (a.host && a.host != window.location.host)
    }
}
/**
 * Annule l'ensemble des requetes HTTP en cours
 */
function abortAllRequest() {
    xhrPool.forEach(element => {
        element.abort();
    });
    xhrPool.length = 0;
}
window.addEventListener("beforeunload", () => {
    abortAllRequest();
    document.querySelectorAll("div.alert").forEach(element => { element.remove(); });
});