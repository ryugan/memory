
/* Classe représentant une carte */
class Card {

	/* Liste des accesseurs */
	#cardName = ''

	/**
 * Représente une carte.
 * @constructor
 * @param {string} cardName - Le nom de la carte
 */
	constructor(cardName) {

		// Si la carte n'a pas de nom
		if (cardName === 'undefied' || cardName === null) {
			cardName = ''
		}

		this.#cardName = cardName;
	}

	/**
   * Retourne le rendu HTML du contenu de la classe sous forme d'une chaîne
   * @return {string} La chaîne HTML représentant le contenu de la classe
   */
	render() {

		// On retourne le résultat de rendu
		return `
			<div class='card card-hide col-sm-1'>
			  <div class='` + this.#cardName + ` hide'></div>
			</div>
		`
	}
}

export default Card
