
/* Classe représentant une carte */
class Card {

	/* Liste des accesseurs */
	#cardName = ''
	#colSpan = 1

	/**
 * Représente une carte.
 * @constructor
 * @param {string} cardName - Le nom de la carte
 * @param {int} colSpan - Le nombre d'espace pris par la colonne
 */
	constructor(cardName, colSpan) {

		// Si la carte n'a pas de nom
		if (typeof cardName === 'undefined' || cardName === null) {
			cardName = ''
		}

		this.#cardName = cardName;

		// Si le nombre d'espace d'une colonne est inconnu
		if (typeof cardName === 'undefined' || cardName === null) {
			colSpan = 1
		}

		this.#colSpan = colSpan;
	}

	/**
   * Retourne le rendu HTML du contenu de la classe sous forme d'une chaîne
   * @return {string} La chaîne HTML représentant le contenu de la classe
   */
	render() {

		// On retourne le résultat de rendu
		return `
			<div class='card card-hide col-sm ` + this.#colSpan + `'>
			  <div class='` + this.#cardName + ` hide'></div>
			</div>
		`
	}
}

export default Card
