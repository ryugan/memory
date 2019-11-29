
import Card from './card.js'

/* todo Définition de la classe de tableau de jeux */
class Board {

	/* Liste des accesseurs */
	#cards = []

	/* todo Constructeur */
	constructor(cards) {

		if (cards === 'undefied' || cards === null) {
			cards = []
		}

		this.#cards = cards;
	}

	/* todo Fonction de rendu HTML du contenu de la classe */
	render() {

		let result = '';

		// On récupère et on compte une seule fois le nombre de cartes
		const cardsNumber = this.#cards === 'undefined' ? 0 : this.#cards.length;

		// S'il n'y a pas de cartes, on ne fait rien
		if (cardsNumber === 0) {
			return result;
		}

		// Définition de variables complémentaires
		var lastCardIndex = cardsNumber -1;
		var halfCardIndex = cardsNumber / 2 -1; // todo prévoir le cas des impairs

		// Il y a une paire de carte
		for (var cpt = 0; cpt < 2; cpt++) {

			// On ouvre une nouvelle ligne de cartes
			result += '<div class=\'row\'>'

			// Il faut placer toutes les cartes
			for (var cpt2 = 0; cpt2 < cardsNumber; cpt2++) {

				let cardName = this.#cards[cpt2];

				// On créée la carte en lui donnant son nom et la fonction à appeler au click
				let card = new Card(cardName, function() {
					this.#cardClick(cardName)
				});

				// Si on est à la moitié de la liste, on ferme la ligne précédente et on en ouvre une autre
				if (cpt2 === halfCardIndex) {
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
		}

		// On retourne le résultat de rendu
		return result;
	}

	/* Fonction de gestion du click d'une carte */
	#cardClick = (cardName) => {
		alert('cardName click: ' + cardName);
	}
}

export default Board
