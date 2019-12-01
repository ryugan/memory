var express = require('express')
var router = express.Router()

/* GET home page. */
const goToIndex = (req, res, next) => res.render('index', { title: 'Memory' })

// On redirige tous les posts et les gets vers la page d'index
router.post('/', goToIndex)
router.post('/index', goToIndex)
router.post('/index.js', goToIndex)
router.get('/', goToIndex)
router.get('/index', goToIndex)
router.get('/index.js', goToIndex)

module.exports = router
