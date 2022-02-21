export const DEFAULT_RESPONSE = "Erreur lors de l'appel de l'API",
    LIST_METHOD = ["GET", "POST"];
export var xhrPool = [];
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
export function callAPI(method, url, data = null, token = null, callbackSuccess = null, callbackFail = null, callbackError = null, callbackAlways = null, sync = true) {
    if (LIST_METHOD.includes(method)) {
        let xhr = new XMLHttpRequest();
        xhrPool.push(xhr);
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if (response.error == "no") {
                        if (callbackSuccess) {
                            callbackSuccess(response);
                        } else {
                            modulesJs.displayAlert("main", "success", "Appel Réussi");
                        }
                    } else {
                        if (callbackFail) {
                            callbackFail(response);
                        } else {
                            modulesJs.displayAlert("main", "warning", response.error);
                        }
                    }
                } else {
                    if (callbackError) {
                        callbackError();
                    } else {
                        modulesJs.displayAlert("main", "danger", "Erreur lors de l'appel de l'API");
                    }
                }
                if (callbackAlways) {
                    callbackAlways();
                }
            }
        };
        xhr.open(method, url + (data != null && method == "GET" ? "?" + (data instanceof FormData ? new URLSearchParams(data).toString() : transformRequest(data)) : ""), sync);
        if (token != null) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send((data != null && method == "POST" ? (data instanceof FormData ? new URLSearchParams(data).toString() : transformRequest(data)) : ""));
    } else {
        throw "Méthode inconnue. Méthode autorisé : " + LIST_METHOD.toString();
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
}
/**
 * Fonction d'affichage des alerts
 * @param {string} selector Nom de l'environnement ou afficher l'alert.
 * @param {string} type "warning" ou "danger".
 * @param {string} message Message afficher dans l'alert.
 * @param {boolean} autoclear Effacer les alerts déjà existantes.
 */
export function displayAlert(selector, type, message, autoclear = true) {
    const typeAlert = {
        "info": {
            className: "alert-info",
            icon: "bi-info-circle"
        },
        "success": {
            className: "alert-success",
            icon: "bi-patch-check"
        },
        "warning": {
            className: "alert-warning",
            icon: "bi-exclamation-triangle"
        },
        "danger": {
            className: "alert-danger",
            icon: "bi-x-octagon"
        }
    };
    if (document.querySelector(selector) == null) {
        throw "Element absence de la page";
    } else {
        document.querySelectorAll(selector + " div.alert").forEach(element => {
            if (autoclear) {
                element.remove();
            }
        });
        let alert = document.createElement("div");
        alert.classList.add("alert", "alert-dismissible", "fade", "show", typeAlert[type].className);
        alert.innerHTML = '<i class="bi ' + typeAlert[type].icon + '"></i> ' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
        document.querySelector(selector).prepend(alert);
    }
}
/**
 * 
 * @param {string} selector Selecteur du bouton
 * @param {string} text Texte à afficher
 * @param {boolean} tiny Afficher le text ou non
 * @param {string} type type de loading (grow ou border)
 * @param {string} size Taille des elements dans le bouton (sm ou lg ou null)
 */
export function loadBtn(selector, text, tiny, type, size = null) {
    if (selector === null) {
        throw "Erreur Selector";
    }
    type = ["grow", "border"].includes(type) ? type : "border";
    size = size != null ? ["sm", "lg"].includes(size) ? size : "sm" : null;
    selector.innerHTML = selector.disabled ? text == null ? "OK" : text : '<span class="spinner-' + type + (size != null ? ' spinner-' + type + '-' + size + '' : '') + '" role="status" aria-hidden="true"></span>' + (tiny !== true ? ' ' + (text == null ? "Chargement..." : text) : '');
    selector.disabled = !selector.disabled;
}
/**
 * Annule l'ensemble des requêtes HTTP en cours
 */
export function abortAllRequest() {
    xhrPool.forEach(element => {
        element.abort();
    });
    xhrPool.length = 0;
}
export const cookie = {
    /**
     * Créer un cookie
     * @param {string} name Nom du cookie
     * @param {string} value Valeur du cookie
     * @param {int} expirationDays Nombre de jours de vie du cookie
     */
    set: function(name, value, expirationDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
        console.log("cookie set");
    },

    /**
     * Cherche un cookie existant en fonction de son nom
     * @param {string} input Nom du cookie à chercher
     * @returns {string} Valeur du cookie si trouvé
     */
    get: function(input) {
        let name = input + "=",
            ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    /**
     * Supprime un cookie existant en fonction de son nom
     * @param {string} name Nom du cookie à supprimer
     */
    delete: function(name) {
        if (this.get(name)) {
            document.cookie = name + "=" + ";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        }
    }

};
export const search = {
    /**
     * Recherche un terme dans une cologne d'un tableau
     * @param {string} idTable Nom du tableau dans lequel chercher
     * @param {int} index Numéro de la cologne dans laquelle chercher
     * @param {string} input Terme rechercher
     * @param {string} typeSearch Type de recherche
     */
    table: function(idTable, index, input = "", typeSearch = "LIKE") {
        if (typeof idTable == "string") {
            let table = document.getElementById(idTable),
                rows = table.querySelector("tbody").rows;
            for (let element of rows) {
                switch (typeSearch) {
                    case "LIKE":
                        if (element.querySelectorAll("td")[index].innerHTML.includes(input)) {
                            if (!element.classList.contains("mustBeMask")) {
                                element.classList.remove("d-none");
                            }
                        } else {
                            element.classList.add("d-none");
                        }
                        break;
                    case "EQUAL":
                        if (element.querySelectorAll("td")[index].innerHTML == input) {
                            if (!element.classList.contains("mustBeMask")) {
                                element.classList.remove("d-none");
                            }
                        } else {
                            element.classList.add("d-none");
                        }
                        break;
                }
            }
        }
    },

    /**
     * Recherche un terme dans une array
     * @param {array} array Array dans lequel chercher
     * @param {int} index Index de l'array dans lequel chercher
     * @param {string} input Terme rechercher
     * @param {string} typeSearch Type de recherche
     * @returns {array}
     */
    array: function(array, index, input = "", typeSearch = "LIKE") {
        let foundArray = [];
        if (typeof array == "object" && array.length > 0) {
            array.forEach(element => {
                if (element[index]) {
                    switch (typeSearch) {
                        case "LIKE":
                            if (element[index].includes(input)) {
                                foundArray.push(element);
                            }
                            break;
                        case "EQUAL":
                            if (element[index] == input) {
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
};
export const sort = {
    /**
     * Fonction de trié des tableau dans l'order croissant et décroissant
     * @param {int} column Numéro de la colonne à trié
     * @param {string} table Id du tableau à trié
     */
    table: function(column, table) {
        let rows, switching, i, shouldSwitch, dir, switchCount = 0,
            current, next;
        table = document.getElementById(table);
        switching = true;
        dir = "asc";
        while (switching) {
            switching = false;
            rows = table.querySelector("tbody").rows;
            if (rows.length) {
                for (i = 0; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
                    current = rows[i].querySelectorAll("td")[column].innerHTML;
                    next = rows[i + 1].querySelectorAll("td")[column].innerHTML;
                    current = (isNaN(current) ? (current.includes("%") || current.includes("€") ? parseFloat(current.split(/( )|(&nbsp;)/)[0]) : current) : parseFloat(current));
                    next = (isNaN(next) ? (next.includes("%") || next.includes("€") ? parseFloat(next.split(/( )|(&nbsp;)/)[0]) : next) : parseFloat(next));
                    if (dir == "asc") {
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
                    if (switchCount == 0 && dir == "asc") {
                        dir = "desc";
                        switching = true;
                    }
                }
            }
        }
    }
};