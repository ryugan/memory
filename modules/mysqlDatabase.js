var mysql = require('mysql')
const { promisify } = require('util')
var fs = require('fs')

const sqlFileCreateDatabase = './sql/createDatabase.sql'
const sqlFileCreateTableScores = './sql/createTableScores.sql'

/* Classe représentant une base de données */
class MysqlDatabase {

  /**
	* Représente une base de données.
	* @constructor
	* @param {string} name - Le nom de la base de données
	* @param {string} host - Le nom ou l'IP du serveur
	* @param {string} port - Le port d'accès au serveur
	* @param {string} user - Le nom de l'utilisateur
	* @param {string} password - Le mot de passe
	* @param {int} connectionLimit - Le nombre de connexion maximal
	*/
	constructor(name, host, port, user, password, connectionLimit) {

    // Si la base de données n'a pas de nom
		if (typeof name === 'undefined' || name === null) {
			throw 'La base de données n\'a pas de nom !'
		}

		this.name = name

    // Si la base de données n'a pas tous les paramètres de connexion
		if (typeof host === 'undefined' || host === null
			|| typeof port === 'undefined' || port === null
			|| typeof user === 'undefined' || user === null
			|| typeof password === 'undefined' || password === null
			|| typeof connectionLimit === 'undefined' || connectionLimit === null
		) {
			throw 'Un des paramètres de connexion à la base de données est incorrect'
		}

		this.connectionParameters = {
			host: host,
	    port: port,
	    user: user,
	    password: password,
			connectionLimit: 10
	  }
	}

  /**
   * Retourne Un Promise du pool de connexion de la base de données
   * @return {Promise} Le Promise du pool de connexion
   */
  async getPool (){
    try {
      const pool = mysql.createPool(this.connectionParameters)

			await pool.getConnection(async (err, connection) => {
			  if (err) {
			    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			      console.error('La connexion à la base de données a été fermée')
			    }
			    if (err.code === 'ER_CON_COUNT_ERROR') {
			      console.error('La base de données a trop de connexion')
			    }
			    if (err.code === 'ECONNREFUSED') {
			      console.error('La connexion à la base de données a été refusée')
			    }
			  }

			  if (connection) connection.release()

			  return
			})

			return pool
    }
    catch(e) {
      console.error(e)
    }
  }

  /**
   * Indique si une base de données existe (-1 : erreur, 0 : n'existe pas, 1 : existe)
	 * @param {string} databaseName - Le nom de la base de données
   * @return {Promise} Promise indiquant si une base de données existe
   */
  async checkSchemaExist(databaseName) {
    try {
      // Récupération de la session
			const query = 'select 1 from information_schema.schemata WHERE schema_name = \'' + databaseName + '\';'
      const result = await this.executeQuery(query)

      // Recherche s'il existe la base de données voulue dans la liste des bases de données
      return result.length
    }
    catch(e) {
      console.error(e)
    }
  }

  /**
   * Indique si une table existe (-1 : erreur, 0 : n'existe pas, 1 : existe)
	 * @param {string} tableName - Le nom de la table
   * @return {Promise} Promise indiquant si une table existe
   */
  async checkTableExist(tableName) {

    try {
      // Construction de la requête pour savoir si la table existe dans la base de données
      const query = 'SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = \'' + this.name + '\' AND TABLE_NAME = \'' + tableName + '\';'
      const result = await this.executeQuery(query)

      // La table existe si le tableau n'est pas vide
      return result.length === 1 ? 1 : 0
    }
    catch(e) {
      console.error(e)
      return -1
    }
  }

  /**
   * Retourne un Promise indiquant si la base de données a dû être créée (-1 : erreur, 0 : existait déjà, 1 : a été créé)
   * @return {Promise} Promise indiquant si la base de données a dû être créée
   */
  async createSchemaIfNotExist() {

    try {

      // Recherche si la base de données existe
      const exist = await this.checkSchemaExist(this.name)

      // Si la base de données n'existe pas on la créée
      if (!exist) {

          console.log ('Création de la base de données : ' + this.name)

          await this.executeFile(sqlFileCreateDatabase)

          return 1
      }

      // La base de données existe
      return 0
    }
    catch(e) {
      console.error(e)
      return -1
    }
  }

  /**promisify
   * Retourne un Promise indiquant si certaines tables ont dû être créées (-1 : erreur, 0 : existaient déjà, 1 : ont toutes été créées, 2 ont été créées partiellement)
	 * @return {Promise} Promise indiquant si certaines tables ont dû être créées
   */
  async createTablesIfNotExist() {

    try {
      // Recherche s'il existe la base de données voules
      const tableName = 'scores'
      const exist = await this.checkTableExist(tableName) == 1

      // Si la table n'existe pas on la créée
      if (!exist) {

        console.log ('Création de la table : ' + tableName)

        await this.executeFile(sqlFileCreateTableScores)

        return 1
      }

      // La base de données existe
      return 0
    }
    catch(e) {
      console.error(e)
      return -1
    }
  }

// todo possibilité de palier le problème en faisant un split sur le ';' et en bouclant sur les lignes
  /**
   * Retourne un Promise avec le résultat du fichier SQL en entrée (Attention le fichier ne doit contenir qu'une commande)
	 * @param {string} filePath - Le chemin d'accès complet au fichier
	 * @return {Promise} Promise avec le résultat de la requête si celle-ci attendait un retour
   */
  async executeFile(filePath) {

    try {

      const readFileAsync = promisify(fs.readFile)
      const queryData = await readFileAsync(filePath, 'utf8')

      return await this.executeQuery(queryData)
    }
    catch(e) {
      console.error(e)
    }
  }

// todo possibilité de palier le problème en faisant un split sur le ';' et en bouclant sur les lignes
  /**
   * Retourne un Promise avec le résultat de la requête si celle-ci attendait un retour (Attention la requête ne doit contenir qu'une commande)
	 * @param {string} query - Le texte de la requête à exécyter
	 * @return {Promise} Promise avec le résultat de la requête si celle-ci attendait un retour
   */
  async executeQuery(queryString) {

    try {
      // Récupération de la session
      const pool = await this.getPool()
			const promiseQuery = promisify(pool.query).bind(pool)

			// On exécute la requête
			const rows = await promiseQuery(queryString)

			// On ferme le pool
			pool.end()

			// On retourne le résultat
			return rows
    }
    catch(e) {
      console.error(e)
    }
  }
}

module.exports = MysqlDatabase
