
import Board from './board.js'

$(document).ready(function () {

  // Initialisation le plateau de jeux
  initBoard(36)

  // Initialisation de la sélection du nombre de cartes
  initSelectCardsNumber()
})

/**
 * Initialisation le plateau de jeux
 */
function initBoard (cardsNumber) {

  // TODO mettre dans une BDD
  const fruits = [
    'red-apple',
    'banana',
    'orange',
    'green-lemon',
    'cranberry',
    'peach',
    'yellow-lemon',
    'strawberry',
    'green-apple',
    'peach2',
    'grapes',
    'watermelon',
    'purple-plum',
    'perry',
    'red-cherry',
    'raspberry',
    'mango',
    'yellow-cherry'
  ].slice(0, cardsNumber / 2) // On réduit la taille de la liste

  const boardElement = $('.board')

  // S'il n'y a pas de plateau il n'y a rien à faire
  if (boardElement.length === 0) {
    return
  }

  // On crée un composant Board
  const boardComposant = new Board(fruits)

  // On récupère le rendu du composant Board
  const render = boardComposant.render()

  // On nettoie le tableau
  boardElement.empty()

  // On ajoute le rendu à l'élément HTML du board
  boardElement.append(render)

  // Initialisation du clic sur les cartes
  initCardsClick()
}

/**
 * Initialise la gestion du clic sur une carte
 */
function initCardsClick () {

  // On ajoute la gestion du clic à la carte
  $('.card').click(function() {
    const elt = $(this)

    // Si la carte est visible ou trouvé on ne fait rien (permet de gérer le double-clic sur la même carte)
    if (elt.hasClass("card-visible") || elt.hasClass("card-find")) {
      return
    }

    // On regarde s'il existe déjà des cartes visibles et non trouvées
    const eltVisible = $(".card-visible").not(".card-find")
    const eltVisibleLength = eltVisible.length

    // On commence par retourner la nouvelle cartes
    elt.removeClass("card-hide").addClass("card-visible")
    elt.children().removeClass("hide")

    // S'il y a plus d'une carte retournée
    if (eltVisibleLength > 1) {

      // On occulte les cartes retournées précédemment
      eltVisible.addClass("card-hide").removeClass("card-visible")
      eltVisible.children().addClass("hide")
    }
    // S'il y avait déjà une carte retournée
    else if (eltVisibleLength === 1) {
      const eltClassName = elt.children().attr("class")
      const eltVisibleClassName = eltVisible.children().attr("class")

      // Si les deux cartes sont du même type
      if (eltClassName === eltVisibleClassName)
      {
        // On note que les cartes ont été trouvées
        elt.addClass("card-find")
        eltVisible.addClass("card-find")
      }
      else {
        console.log("pas trouvé")
      }
    }
    // Sinon il n'y avait pas de cartes retournées précédemment
  })
}

/**
 * Initialise la gestion du clic sur la sélection du nombre de carte
 */
function initSelectCardsNumber () {

  // On recherche une seule fois l'élément
  const select = $("#select-cards-number")

  // On applique le change
  select.change(function() {

    // On récupère la valeur sélectionnée
    const selectedValue =  select.val()

    // On initialise le tableau avec cette valeur
    initBoard(selectedValue)
  })


}
