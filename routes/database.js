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
    const forwarded = req.headers['x-real-ip']
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

    // Récupération des données transmises
    const data = req.body

    console.log(req.headers['x-forwarded-for'])
    console.log(req.headers['x-real-ip'])
    console.log(req.connection.remoteAddress)

    //database.executeQuery('INSERT INTO memory.scores (DateScore, PlayerId, SecondDuration, CardsNumber) VALUES (\'' + data.date + '\', \'' + ip + '\', ' + data.secondsDuration + ', ' + data.cardsNumber + ');')
  }
  catch (e) {
    console.error(e)
  }
})

module.exports = router
