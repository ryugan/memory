
/* todo Définition de la classe de carte de jeux */
class Card {

	/* Liste des accesseurs */
	#cardName = ''
	#onClick = null
	
	/* todo Constructeur */
	constructor(cardName, onClick) {
		
		// Si la carte n'a pas de nom
		if (cardName === 'undefied' || cardName === null) {
			cardName = ''
		}
		
		this.#cardName = cardName;
		
		// S'il n'y a pas de fonction défini pour le click
		if (onClick === 'undefied' || onClick === null) {
			onClick = () => {};
		}
		
		this.#onClick = onClick;
	}
	
	/* todo Fonction de rendu HTML du contenu de la classe */
	render() {
		
		// On retourne le résultat de rendu	
		return `
			<div class='card col-sm-3'>
			  <div class='` + this.#cardName + `' onClick='` + this.#onClick + `'></div>
			</div>
		`
	}
}

export default Card