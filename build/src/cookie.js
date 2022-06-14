
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

export default cookie;