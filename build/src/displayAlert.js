/* eslint-disable no-console */

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

export default displayAlert;