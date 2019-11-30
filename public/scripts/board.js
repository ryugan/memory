
import Card from './card.js'

/* Classe représentant un tableau de jeux */
class Board {

	/* Liste des accesseurs */
	#cards = []

	/**
 * Représente un tableau de jeux.
 * @constructor
 * @param {Card} cards - Les cartes du tableau de jeux
 */
	constructor(cards) {

		if (cards === 'undefied' || cards === null) {
			cards = []
		}

		this.#cards = cards;
	}

  /**
   * Retourne le rendu HTML du contenu de la classe sous forme d'une chaîne
   * @return {string} La chaîne HTML représentant le contenu de la classe
   */
	render() {

		let result = '';

		// On récupère et on compte une seule fois le nombre de cartes
		let cardsNumber = this.#cards === 'undefined' ? 0 : this.#cards.length;

		// S'il n'y a pas de cartes, on ne fait rien
		if (cardsNumber === 0) {
			return result;
		}

		// On ajoute la paire de chaque carte
		const cards = this.#cards.concat(this.#cards)
		cardsNumber *= 2

		// Définition de variables complémentaires
		let lastCardIndex = cardsNumber -1;

		// On mélange les cartes
		this.shuffleCards()

		// On ouvre une nouvelle ligne de cartes
		result += '<div class=\'row\'>'

		// On détermine la valeur du modulo
		const moduloValue = cardsNumber / 4;

		// Il faut placer toutes les cartes
		for (let cpt = 0; cpt < cardsNumber; cpt++) {

			let cardName = cards[cpt];

			// On créée la carte en lui donnant son nom et la fonction à appeler au click
			let card = new Card(cardName)

			// S'il reste 0 à une division par le modulo, on ferme la ligne précédente et on en ouvre une autre (sauf si c'est déjà la première ligne)
			if (cpt != 0 && cpt % moduloValue === 0)  {
				result += `
					</div>
					<div class=\'row\'>
				`
			}

			// On récupère le rendu de la carte
			result += card.render();
		}

			// On clôture la ligne de carte
			result += '</div>'

		// On retourne le résultat de rendu
		return result;
	}

	/**
   * Mélange les cartes du tableau de jeux
   */
	shuffleCards() {

		// On récupère et on compte une seule fois le nombre de cartes
		const cardsNumber = this.#cards === 'undefined' ? 0 : this.#cards.length;

		// Mélange les cartes
    for (let cpt = cardsNumber -1; cpt > 0; cpt--) {

				// On détermine une position aléatoire
        const cpt2 = Math.floor(Math.random() * (cpt + 1));

				// On intervertit les positions
        [this.#cards[cpt], this.#cards[cpt2]] = [this.#cards[cpt2], this.#cards[cpt]];
    }
	}
}

export default Board
