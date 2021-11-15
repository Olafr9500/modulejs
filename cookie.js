/**
 * Créer un cookie
 * @param {string} cname Nom du cookie
 * @param {string} cvalue Valeur du cookie
 * @param {int} exdays Nombre de jours de vie du cookie
 */
 function setCookie(cname, cvalue, exdays) {
	let d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	console.log("cookie set");
}

/**
 * Cherche un cookie existant en fonction de son nom
 * @param {string} cname Nom du cookie à chercher
 * @returns {string} Valeur du cookie si trouvé
 */
function getCookie(cname) {
	let name = cname + "=",
		ca = document.cookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
/**
 * Supprime un cookie existant en fonction de son nom
 * @param {string} name Nom du cookie à supprimer
 */
function deleteCookie(name) {
  if( getCookie(name) ) {
    document.cookie = name + "=" + ";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}