var express = require('express')
var router = express.Router()
var Database = require('../modules/database')

const database = new Database('memory', 'dbuser:123456@localhost:33060')

// Gestion de la demande des scores
router.get('/getScores', function (req, res, next) {
  database.executeQuery('SELECT * FROM memory.scores;', function (rows) {

    res.redirect('/customers');
  })
})

// Gestion de l'insertion d'un nouveau score
router.post('/insertScore', function (req, res, next) {

  try {
    // Récupération de l'ip en tant qu'identifiant utilisateur
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress

    // Récupération des données transmises
    const data = req.body

    database.executeQuery('INSERT INTO memory.scores (DateScore, PlayerId, SecondDuration, CardsNumber) VALUES (\'' + data.date + '\', \'' + ip + '\', ' + data.secondsDuration + ', ' + data.cardsNumber + ');')
  }
  catch (e) {
    console.error(e)
  }
})

module.exports = router
