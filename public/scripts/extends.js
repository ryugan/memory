
/*************/
/*  String  */
/************/

/**
 * Remplace une chaîne où les occurences d'une expression sont remplacées par une autre chaîne
 * @param {string} search - La sous-chaîne à remplacer
 * @param {string} search - La sous-chaîne à placer
 * @return {string} La chaîne mise à jour
 */
String.prototype.replaceAll = (search, replace) => this.replace(new RegExp(RegExp.escape(search), 'g'), replace)

/**
 * Retourne si une chaîne est nulle ou vide
 * @param {string} value - La chaîne à contrôler
 * @return {bool} Si la chaîne est nulle ou vide
 */
String.isNullOrEmpty = (value) => !(typeof value === 'string' && value.length > 0)

/**
 * Retourne si une chaîne est nulle ou convient des espaces
 * @param {string} value - La chaîne à contrôler
 * @return {bool} Si la chaîne est nulle ou contient des espaces
 */
String.isNullOrWhitespace = (value) => !(typeof value === 'string' && value.replace(/\s/g, '').length > 0)

/**
 * Retourne la sous chaîne à gauche d'une position
 * @param {int} position - La position dans la chaîne
 * @return {string} La sous chaîne à gauche
 */
String.prototype.left = (position) => this.substring(0, position)

/**
 * Retourne la sous chaîne à droite d'une position
 * @param {int} position - La position dans la chaîne
 * @return {string} La sous chaîne à droite
 */
String.prototype.right = (position) => {
    let result = ''

    if (this.length > 0) {
        const end = this.length - 1
        result = this.substring(end - position, end)
    }

    return result
}

/*************/
/*  Array  */
/************/

/**
 * Retourne le tableau mélangé
 */
Array.prototype.shuffle = function() {

  // On récupère et on compte une seule fois le nombre d'élément
  const length = this.length;

  // Mélange les cartes
  for (let cpt = length - 1; cpt > 0; cpt--) {

    // On détermine une position aléatoire
    var cpt2 = Math.floor(Math.random() * (cpt + 1))

    // On intervertit les positions
    var temp = this[cpt]
    this[cpt] = this[cpt2]
    this[cpt2] = temp
  }
}
