var express = require('express')
var router = express.Router()
var HttpStatus = require('http-status-codes')

// Récupération de l'accès à la base de données
const database = global.database

// Gestion de la demande des scores
router.get('/getScores', async function (req, res, next) {

  try {

    // Récupération des données transmises
    const data = req.query

    // Création de la requête, on prend les 5 meilleurs temps pour un nombre de cartes jouées (priorité au temps le plus petit, puis par date de réussite)
    const query = 'SELECT DateScore, PlayerId, SecondDuration FROM memory.scores WHERE CardsNumber = ' + data.cardsNumber + ' ORDER BY SecondDuration, DateScore LIMIT 5;'

    // On récupère les lignes en résultat
    const rows = await database.executeQuery(query)

    // On transmet les résultats au client
    return res.json({
      data: {
        code: 'ok',
        rows: rows
      }
    })
  }
  catch (e) {
    console.error(e)

    res.status(HttpStatus.INTERNAL_SERVER_ERROR)

    return res.json({
      data: null,
      error: {
        code: -1,
        message: e
      }
    })
  }
})

// Gestion de l'insertion d'un nouveau score
router.post('/insertScore', function (req, res, next) {

  try {
    // Récupération de l'ip en tant qu'identifiant utilisateur
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress

    // Récupération des données transmises
    const data = req.body

    database.executeQuery('INSERT INTO memory.scores (DateScore, PlayerId, SecondDuration, CardsNumber) VALUES (\'' + data.date + '\', \'' + ip + '\', ' + data.secondsDuration + ', ' + data.cardsNumber + ');')

    res.status(HttpStatus.OK)

    return res.json({
      data: {
        code: 'ok'
      },
      error: null
    })
  }
  catch (e) {
    console.error(e)

    res.status(HttpStatus.INTERNAL_SERVER_ERROR)

    return res.json({
      data: null,
      error: {
        code: -1,
        message: e
      }
    })
  }
})

module.exports = router
