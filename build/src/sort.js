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

export default sort;