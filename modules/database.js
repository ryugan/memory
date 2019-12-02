var mysqlx = require('@mysql/xdevapi')
const { promisify } = require('util')
var fs = require('fs')

const sqlFileCreateDatabase = './sql/createDatabase.sql'
const sqlFileCreateTableScores = './sql/createTableScores.sql'

/* Classe représentant une base de données */
class Database {

  /**
	* Représente une base de données.
	* @constructor
	* @param {string} name - Le nom de la base de données
	* @param {string} host - Le nom ou l'IP du serveur
	* @param {string} port - Le port d'accès au serveur
  * @param {string} user - Le nom de l'utilisateur
	* @param {string} password - Le mot de passe
	*/
	constructor(name, host, port, user, password) {

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
		) {
			throw 'Un des paramètres de connexion à la base de données est incorrect'
		}

		this.connectionParameters = {
			host: host,
	    port: port,
	    user: user,
	    password: password
	  }
	}

  /**
   * Retourne Un Promise de la session de la base de données
   * @return {Promise} Le Promise de la session
   */
  async getSession (){
    try {
      return mysqlx.getSession(this.connectionParameters)
    }
    catch(e) {
      console.error(e)
    }
  }

  /**
   * Indique si une base de données existe (-1 : erreur, 0 : n'existe pas, 1 : existe)
   * @return {Promise} Promise indiquant si une base de données existe
   */
  async checkSchemaExist(databaseName) {
    try {
      // Récupération de la session
      const session = await this.getSession()

      // Récupération de la liste des bases de données
      const schemas = await session.getSchemas()

      // Recherche s'il existe la base de données voulue dans la liste des bases de données
      return schemas.some((s) => s.getName() === this.name) ? 1 : 0
    }
    catch(e) {
      console.error(e)
    }
  }

  /**
   * Indique si une table existe (-1 : erreur, 0 : n'existe pas, 1 : existe)
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
      const exist = await this.checkSchemaExist(this.name) == 1

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

  /**
   * Retourne un Promise indiquant si certaines tables ont dû être créées (-1 : erreur, 0 : existaient déjà, 1 : ont toutes été créées, 2 ont été créées partiellement)
   * @return {Promise} Promise indiquant si certaines tables ont dû être créées
   */
  async createTablesIfNotExist(session) {

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
   * @return {Promise} Promise avec le résultat de la requête si celle-ci attendait un retour
   */
  async executeFile(filePath) {

    try {

      const readFileAsync = promisify(fs.readFile)
      const queryData = await readFileAsync(filePath, 'utf8')

      return await this.executeQuery(queryData, callback)
    }
    catch(e) {
      console.error(e)
    }
  }

// todo possibilité de palier le problème en faisant un split sur le ';' et en bouclant sur les lignes
  /**
   * Retourne un Promise avec le résultat de la requête si celle-ci attendait un retour (Attention la requête ne doit contenir qu'une commande)
   * @return {Promise} Promise avec le résultat de la requête si celle-ci attendait un retour
   */
  async executeQuery(query) {

    try {
      // Récupération de la session
      const session = await this.getSession()


			// Récupération du retour de la requête
			const execute = await session.sql(query).execute()
			const resultArray = execute.toArray()

			// Retour sous la forme d'un tableau
			return resultArray.length ? resultArray[0] : []
    }
    catch(e) {
      console.error(e)
    }
  }
}

module.exports = Database
