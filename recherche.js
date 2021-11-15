/**
 * Recherche un terme dans une cologne d'un tableau
 * @param {string} idTable Nom du tableau dans lequel chercher
 * @param {int} index Numéro de la cologne dans laquel chercher
 * @param {string} input Terme rechercher
 * @param {string} typeSearch Type de recherche
 */
function searchTable(idTable,  index, input = "", typeSearch = "LIKE") {
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
}
/**
 * Recherche un terme dans une array
 * @param {array} array Array dans lequel chercher
 * @param {int} index Index de l'array dans lequel chercher
 * @param {string} input Terme rechercher
 * @param {string} typeSearch Type de recherche
 * @returns {array}
 */
function searchArray(array, index, input = "", typeSearch = "LIKE") {
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