
/**
 * Fonction d'affichage des alerts
 * @param {string} selector Nom de l'environement ou afficher l'alert
 * @param {string} type "warning" ou "danger"
 * @param {string} message Message afficher dans l'alert
 */
function displayAlert(selector, type, message) {
    const typeAlert = {
        "info": {
            icon: "bi-info-circle"
        },
        "success": {
            icon: "bi-patch-check"
        },
        "warning": {
            icon: "bi-exclamation-triangle"
        },
        "danger": {
            icon: "bi-x-octagon"
        }
    };
    document.querySelectorAll(selector + " div.alert").forEach(element => { element.remove(); });
    let alert = document.createElement("div");
    alert.classList.add("alert", "alert-dismissible", "fade", "show", "alert-" + type);
    alert.innerHTML = '<i class="bi ' + (typeAlert[type] ? typeAlert[type].icon : "") + '"></i> ' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    document.querySelector(selector).prepend(alert);
}