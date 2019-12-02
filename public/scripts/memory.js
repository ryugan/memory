
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

  // On affiche les victoires
  showVictory(function() {

    // Note : Comme on est sympathique, on ne déclenche pas le chrono tant que l'utilisateur n'a pas confirmé avoir vu les scores

    // Initialisation du clic sur les cartes
    initCardsClick()

    // Initialisation de la progressbar (en millisecond)
    initCircleProgress(90000) // 1min30 = 1.5 * 60 * 1000
  })
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
 * Initialise le circle progress
 */
function initCircleProgress (duration) {

  // On nettoie le circle progress
  $('#progress').empty()

  // On met à jour les paramètres à exécuter
  const circleParameters = {
    color: '#28a745',
    duration: duration, // en milliseconds
    easing: 'linear', // avance de façon linéaire
    trailWidth: 2, // largeur du trait du cercle en fond
    strokeWidth: 4, // largeur du trait de l'avancement
    from: { color: '#28a745', width: 2 },
    to: { color: duration === 0 ? '#28a745' : '#dc3545', width: 4 }, // Cas particulier du démarrage où la durée est à zéro, on laisse la couleur du début
    step: function (state, circle) {
      stepCircleProgress(state, circle, duration)
    }
  }

  // On recrée un circle progress à partir d'un ProgressBar
  const circle = new ProgressBar.Circle('#progress', circleParameters)

  // On anime le cercle une fois
  try {
    circle.animate(1)
  }
  catch (e) {
    // On ne fait rien, c'est juste pour occulter le message "Uncaught (in promise)" du circle progress qui gère mal le stop/rafraichissement
  }
}

/**
 * Gére le comportement d'avancement du circle progress
 */
function stepCircleProgress (state, circle, duration) {
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
  const minutesRemaining = parseInt(secondsTotalRemaining / 60).toString().padStart(2, '0')
  const secondsRemaining = parseInt(secondsTotalRemaining % 60).toString().padStart(2, '0')

  // On affiche une chaîne contenant le temps restant
  const showValue = String.format('{0}:{1}', minutesRemaining, secondsRemaining)

  circle.setText(showValue)

  // Si le compte à rebours est terminé
  if (secondsTotalRemaining === 0) {

    // On arrête le timer
    circle.stop()

    // On empêche l'utilisateur de cliquer sur les cartes
    $('.card').unbind()

    // Si l'on n'est pas dans le cas particulier du démarrage où la durée est à 0
    if (duration > 0) {
      // On avertit l'utilisateur qu'il a perdu, soit il recommence, soit on ne fait rien
      warningDialog('Temps écoulé !', 'Tu as perdu....', 'La prochaine sera la meilleure !', 'Une prochaine fois...', reloadBoard, null)
    }
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
      const description = String.format('Tu as gagné en {0} min et {1} sec', minutesPassed, secondsPassed)
      successDialog('Victoire !', description, 'Je peux faire encore mieux !', 'Non merci', reloadBoard, null)

      // On transmet la victoire au serveur
      insertVictory(secondsTotalPassed)
    }
  }
}

/**
 * Informe le serveur qu'il faut insérer une nouvelle victoire
 * @param {int} secondsDuration - Le nombre de secondes mis pour gagner
 */
async function insertVictory (secondsDuration) {

  // On note la date de Victoire
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ')

  // On récupère le nombre de cartes sélectionnée
  const selectedValue =  $('#select-cards-number').val()

  // On format les données à transmettre
  const data = {
    date: date,
    secondsDuration: secondsDuration,
    cardsNumber: selectedValue
  }

  // On envoie la demande d'insertion
  $.post('/database/insertScore', data, function(response) {
    // On ne fait rien, ce n'est pas important si l'utilisateur ne sait pas que la BDD ne répond pas
  })
  .fail(function() {
    // On ne fait rien, ce n'est pas important si l'utilisateur ne sait pas que la BDD ne répond pas
  })
}

/**
 * Demande au serveur la liste des meilleurs victoires par rapport au nombre de cartes
 * @param {Function} callback - Un callback à exécuter après l'appel en base de données
 */
async function showVictory (callback) {

  // On récupère le nombre de cartes sélectionnée
  const selectedValue =  $('#select-cards-number').val()

  const data = {
    cardsNumber: selectedValue
  }

  // En cas de réaffichage, il faut désactiver le compteur pour éviter de stresser le joueur qui voit le temps défiler
  initCircleProgress(0)

  // On demande au serveur les meilleurs victoires pour le nombre de cartes
  $.get('/database/getScores', data, function(response) {

    if (response.data === null || response.data.rows === null || response.error === null) {
      // On débloque le joueur pour qu'il puisse au moins joueur
      callback()

      return
    }

    // On prépare des messages par défaut, notamment s'il n'y a pas eu de vainqueurs
    let title = 'A l\'aventure compagnon !'
    let btnMessage = 'Je vais exploser le compteur !'
    let message = 'Nous sommes encore à la recherche d\'un champion d\'une partie à ' + selectedValue + ' cartes...\n Tu crois vraiment en être capable ?'

    // On regarde s'il y a déjà des victoires
    const rows = response.data.rows
    const rowsLength = rows.length

    // S'il y a déjà eu des vainqueurs
    if (rows.length) {
      // On écrase les textes par défaut
      title = String.format('Nos champions pour {0} cartes !', selectedValue)
      btnMessage = 'Je vais faire mieux !'
      message = ''

      for (let cpt = 0; cpt < rowsLength; cpt++) {
        const row = rows[cpt]

        const position = cpt + 1
        const minutes = parseInt(row.SecondDuration / 60).toString().padStart(2, '0')
        const seconds = parseInt(row.SecondDuration % 60).toString().padStart(2, '0')
        const date = new Date(row.DateScore).toLocaleString('fr-FR')

        const subMessage = String.format('En position {0}, le joueur "{1}" en {2} min et {3} sec le {4}.\n', position, row.PlayerId, minutes, seconds, date)

        message += subMessage
      }
    }

    // On prévient le joueur des meilleurs temps
    primaryDialog(title, message, btnMessage, null, function() {

      // On appelle le callback
      if (typeof callback !== 'undefined' && callback != null) {
        callback()
      }
    }, null)
  })
  .fail(function() {
    // On débloque le joueur pour qu'il puisse au moins joueur
    callback()
  })
}
