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

export default abortAllRequest;
export { xhrPool };