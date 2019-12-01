
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

  // Initialisation de la progressbar (en millisecond)
  initProgressBar(120000) // 2min = 5 * 60 * 1000
}

/**
 * Initialise la gestion du clic sur une carte
 */
function initCardsClick () {

  // On ajoute la gestion du clic à la carte
  $('.card').click(function() {
    const elt = $(this)

    // Si la carte est visible ou trouvé on ne fait rien (permet de gérer le double-clic sur la même carte)
    if (elt.hasClass('card-visible') || elt.hasClass('card-find')) {
      return
    }

    // On regarde s'il existe déjà des cartes visibles et non trouvées
    const eltVisible = $('.card-visible').not('.card-find')
    const eltVisibleLength = eltVisible.length

    // On commence par retourner la nouvelle cartes
    elt.removeClass('card-hide').addClass('card-visible')
    elt.children().removeClass('hide')

    // S'il y a plus d'une carte retournée
    if (eltVisibleLength > 1) {

      // On occulte les cartes retournées précédemment
      eltVisible.addClass('card-hide').removeClass('card-visible')
      eltVisible.children().addClass('hide')
    }
    // S'il y avait déjà une carte retournée
    else if (eltVisibleLength === 1) {

      const eltClassName = elt.children().attr('class')
      const eltVisibleClassName = eltVisible.children().attr('class')

      // Si les deux cartes sont du même type
      if (eltClassName === eltVisibleClassName)
      {
        // On note que les cartes ont été trouvées
        elt.addClass('card-find')
        eltVisible.addClass('card-find')
      }
      // Sinon on ne fait rien
    }
    // Sinon il n'y avait pas de cartes retournées précédemment
  })
}

/**
 * Initialise la gestion du clic sur la sélection du nombre de carte
 */
function initSelectCardsNumber () {

  // Le changement du nombre de carte recharge le tableau
  $('#select-cards-number').change(reloadBoard)
}

/**
 * Recharge le tableau
 */
function reloadBoard () {

  // On récupère le nombre de cartes sélectionnée
  const selectedValue =  $('#select-cards-number').val()

  // On initialise le tableau avec cette valeur
  initBoard(selectedValue)
}

/**
 * Initialise la progress bar
 */
function initProgressBar (duration) {

  // On nettoie la progressbar
  $('#progress').empty()

  // On définie les paramètres
  const circleParameters = {
    color: '#28a745',
    duration: duration, // en milliseconds
    easing: 'linear', // avance de façon linéaire
    trailWidth: 2, // largeur du trait du cercle en fond
    strokeWidth: 4, // largeur du trait de l'avancement
    from: { color: '#28a745', width: 2 },
    to: { color: '#dc3545', width: 4 },
    step: function (state, circle) {
      stepProgressBar(state, circle, duration)
    }
  }

  // On recrée une progressbar
  const circle = new ProgressBar.Circle('#progress', circleParameters)

  // On anime le cercle une fois
  circle.animate(1)

}

/**
 * Gére le comportement d'avancement de la progressbar
 */
function stepProgressBar (state, circle, duration) {
  // Application des règles du From To
  circle.path.setAttribute('stroke', state.color)
  circle.path.setAttribute('stroke-width', state.width)

  // Récupération de la valeur du cercle (entre 0 et 1)
  const circleValue = circle.value()

  // Après avoir appliqué le stop, circle.value() return NaN et il faut appliquer un second stop pour un arrêt définitif
  if (isNaN(circleValue)) {
    circle.stop()
    return
  }

  // Calcul du temps représentant
  const secondsTotalRemaining = (duration - duration * circleValue) / 1000
  const minutesRemaining = parseInt(secondsTotalRemaining / 60)
  const secondsRemaining = parseInt(secondsTotalRemaining % 60)

  // On affiche une chaîne contenant le temps restant
  const showValue = minutesRemaining.toString().padStart(2, '0') + ':' + secondsRemaining.toString().padStart(2, '0')

  circle.setText(showValue)

  // Si le compte à rebours est terminé
  if (secondsTotalRemaining === 0) {

    // On arrête le timer
    circle.stop()

    // On empêche l'utilisateur de cliquer sur les cartes
    $('.card').unbind()

    // On avertit l'utilisateur qu'il a perdu, soit il recommence, soit on ne fait rien
    warningDialog('Temps écoulé !', 'Tu as perdu....', 'La prochaine sera la meilleure !', 'Une prochaine fois...', reloadBoard, null)
  }
  else {

    // On recherche s'il reste des cartes non trouvées
    const eltHidden = $('.card-hide')
    const eltHiddenLength = eltHidden.length

    // S'il n'en reste plus, le joueur a gagné
    if (eltHiddenLength === 0) {

      // On arrête le timer
      circle.stop()

      // Calcul du temps de victoire
      const secondsTotalPassed = duration * circleValue / 1000
      const minutesPassed = parseInt(secondsTotalPassed / 60)
      const secondsPassed = parseInt(secondsTotalPassed % 60)

      // On avertit l'utilisateur qu'il a gagné, soit il recommence, soit on ne fait rien
      successDialog('Victoire !', 'Tu as gagné en ' + minutesPassed + ' min et ' + secondsPassed + ' sec', 'Je peux faire encore mieux !', 'Non merci', reloadBoard, null)

      // On transmet la victoire au serveur
      insertVictory(secondsTotalPassed)
    }
  }
}

/**
 *
 */
function insertVictory (secondsDuration) {

  // On note la date de Victoire
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // On récupère le nombre de cartes sélectionnée
  const selectedValue =  $('#select-cards-number').val()

  // On format les données à transmettre
  const data = {
    date: date,
    secondsDuration: secondsDuration,
    cardsNumber: selectedValue
  }

  // On envoie la demande d'insertion
  $.post('/database/insertScore', data, function() {
    alert('success')
  })
  .done(function() {
    alert('second success')
  })
  .fail(function() {
    alert('error')
  })
}
