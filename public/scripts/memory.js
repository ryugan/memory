
import Board from './board.js'

$(document).ready(function () {

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
  ]

  const boardElement = $('.board')

  // S'il n'y a pas de plateau il n'y a rien à faire
  if (boardElement.length === 0) {
    return
  }

  // On crée un composant Board
  const boardComposant = new Board(fruits)

  // On récupère le rendu du composant Board
  const render = boardComposant.render()

  // On ajoute le rendu à l'élément HTML du board
  boardElement.append(render)

  // On ajoute la gestion du clic à la carte
  $('.card').click(function() {
    const elt = $(this)

    // Si la carte est visible ou trouvé on ne fait rien (permet de gérer le double-clic sur la même carte)
    if (elt.hasClass("card-visible") || elt.hasClass("card-find")) {
      return
    }

    // On regarde si la carte est la seule à ne pas être caché
    const eltVisible = $(".card-visible").not(".card-find")
    const eltVisibleLength = eltVisible.length

    // S'il y a plus d'un élément retournée
    if (eltVisibleLength > 1) {

      // On occulte les cartes retournéesp
      eltVisible.addClass("card-hide").removeClass("card-visible")
      eltVisible.children().addClass("hide")
    }
    else {

      // On commence par retournée la nouvelle carte
      elt.removeClass("card-hide").addClass("card-visible")
      elt.children().removeClass("hide")

      // S'il y avait déjà une carte retournée
      if (eltVisibleLength === 1) {
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
    }
  })

})
