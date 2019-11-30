
// todo Faire en faire un module

/**
 * Créé dynamiquement un BootstrapDialog générique
 * @param {string} title - Le titre du dialog
 * @param {string} message - Le message du dialog
 * @param {string} typeStyle - Le style de BootstrapDialog
 * @param {string} btnStyle - Le style de bouton bootstrap
 * @param {string} buttonTextOk - Le libellé du bouton OK
 * @param {string} buttonTextCancel - Le libellé du bouton Cancel
 * @param {function} callbackOk - Le callback a appelé en cas de clic sur le bouton OK
 * @param {function} callbackCancel - Le callback a appelé en cas de clic sur le bouton Cancel
 * @return {BootstrapDialog} Le BootstrapDialog dynamique
 */
function genericDialog (title, message, typeStyle, btnStyle, buttonTextOk, buttonTextCancel, callbackOk, callbackCancel) {

  // Propagation d'un null s'il n'y a pas de callbacks
  callbackOk = typeof callbackOk === 'undefined' ? null : callbackOk
  callbackCancel = typeof callbackCancel === 'undefined' ? null : callbackCancel

  const buttons = []

  // On ajoute le bouton OK s'il possède un texte ou une fonction
  if (!String.isNullOrEmpty(buttonTextOk) || callbackOk != null) {

    buttons.push({
      label: buttonTextOk,
      cssClass: btnStyle + ' btn-ok',
      action: function (dialog) {
        if (callbackOk != null) {
          callbackOk(null, null, null)
        }
        newDialog.close()
      }
    })
  }

  // On ajoute le bouton Cancel s'il possède un texte ou une fonction
  if (!String.isNullOrEmpty(buttonTextCancel) || callbackCancel != null) {

    buttons.push({
      label: buttonTextCancel,
      cssClass: btnStyle + ' btn-cancel',
      action: function (dialog) {
        if (callbackCancel != null) {
          callbackCancel(null, null, null)
        }
        newDialog.close()
      }
    })
  }

  // Création du BootstrapDialog dynamique
  const newDialog = new BootstrapDialog({
    title: title,
    message: message,
    type: typeStyle,
    buttons: buttons
  })

  // Ouverture du BootstrapDialog
  newDialog.open()
}

/**
 * Créé dynamiquement un BootstrapDialog de type défaut
 * @param {string} title - Le titre du dialog
 * @param {string} message - Le message du dialog
 * @param {string} buttonTextOk - Le libellé du bouton OK
 * @param {string} buttonTextCancel - Le libellé du bouton Cancel
 * @param {function} callbackOk - Le callback a appelé en cas de clic sur le bouton OK
 * @param {function} callbackCancel - Le callback a appelé en cas de clic sur le bouton Cancel
 * @return {BootstrapDialog} Le BootstrapDialog dynamique de type défaut
 */
function defaultDialog (title, message, buttonTextOk, buttonTextCancel, callbackOk, callbackCancel) {
    genericDialog(title, message, BootstrapDialog.TYPE_DEFAULT, "btn-default", buttonTextOk, buttonTextCancel, callbackOk, callbackCancel);
}

/**
 * Créé dynamiquement un BootstrapDialog de type primaire
 * @param {string} title - Le titre du dialog
 * @param {string} message - Le message du dialog
 * @param {string} buttonTextOk - Le libellé du bouton OK
 * @param {string} buttonTextCancel - Le libellé du bouton Cancel
 * @param {function} callbackOk - Le callback a appelé en cas de clic sur le bouton OK
 * @param {function} callbackCancel - Le callback a appelé en cas de clic sur le bouton Cancel
 * @return {BootstrapDialog} Le BootstrapDialog dynamique de type primaire
 */
function primaryDialog (title, message, buttonTextOk, buttonTextCancel, callbackOk, callbackCancel) {
    genericDialog(title, message, BootstrapDialog.TYPE_PRIMARY, "btn-primary", buttonTextOk, buttonTextCancel, callbackOk, callbackCancel);
}

/**
 * Créé dynamiquement un BootstrapDialog de type succès
 * @param {string} title - Le titre du dialog
 * @param {string} message - Le message du dialog
 * @param {string} buttonTextOk - Le libellé du bouton OK
 * @param {string} buttonTextCancel - Le libellé du bouton Cancel
 * @param {function} callbackOk - Le callback a appelé en cas de clic sur le bouton OK
 * @param {function} callbackCancel - Le callback a appelé en cas de clic sur le bouton Cancel
 * @return {BootstrapDialog} Le BootstrapDialog dynamique de type succès
 */
function successDialog (title, message, buttonTextOk, buttonTextCancel, callbackOk, callbackCancel) {
    genericDialog(title, message, BootstrapDialog.TYPE_SUCCESS, "btn-success", buttonTextOk, buttonTextCancel, callbackOk, callbackCancel);
}

/**
 * Créé dynamiquement un BootstrapDialog de type information
 * @param {string} title - Le titre du dialog
 * @param {string} message - Le message du dialog
 * @param {string} buttonTextOk - Le libellé du bouton OK
 * @param {string} buttonTextCancel - Le libellé du bouton Cancel
 * @param {function} callbackOk - Le callback a appelé en cas de clic sur le bouton OK
 * @param {function} callbackCancel - Le callback a appelé en cas de clic sur le bouton Cancel
 * @return {BootstrapDialog} Le BootstrapDialog dynamique de type information
 */
function infoDialog (title, message, buttonTextOk, buttonTextCancel, callbackOk, callbackCancel) {
    genericDialog(title, message, BootstrapDialog.TYPE_INFO, "btn-info", buttonTextOk, buttonTextCancel, callbackOk, callbackCancel);
}

/**
 * Créé dynamiquement un BootstrapDialog de type attention
 * @param {string} title - Le titre du dialog
 * @param {string} message - Le message du dialog
 * @param {string} buttonTextOk - Le libellé du bouton OK
 * @param {string} buttonTextCancel - Le libellé du bouton Cancel
 * @param {function} callbackOk - Le callback a appelé en cas de clic sur le bouton OK
 * @param {function} callbackCancel - Le callback a appelé en cas de clic sur le bouton Cancel
 * @return {BootstrapDialog} Le BootstrapDialog dynamique de type attention
 */
function warningDialog (title, message, buttonTextOk, buttonTextCancel, callbackOk, callbackCancel) {
    genericDialog(title, message, BootstrapDialog.TYPE_WARNING, "btn-warning", buttonTextOk, buttonTextCancel, callbackOk, callbackCancel);
}

/**
 * Créé dynamiquement un BootstrapDialog de type danger
 * @param {string} title - Le titre du dialog
 * @param {string} message - Le message du dialog
 * @param {string} buttonTextOk - Le libellé du bouton OK
 * @param {string} buttonTextCancel - Le libellé du bouton Cancel
 * @param {function} callbackOk - Le callback a appelé en cas de clic sur le bouton OK
 * @param {function} callbackCancel - Le callback a appelé en cas de clic sur le bouton Cancel
 * @return {BootstrapDialog} Le BootstrapDialog dynamique de type danger
 */
function dangerDialog (title, message, buttonTextOk, buttonTextCancel, callbackOk, callbackCancel) {
    genericDialog(title, message, BootstrapDialog.TYPE_DANGER, "btn-danger", buttonTextOk, buttonTextCancel, callbackOk, callbackCancel);
}
