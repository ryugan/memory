var createError = require('http-errors')
var express = require('express')
var path = require('path')

var cookieParser = require('cookie-parser') // todo à conserver ?
var logger = require('morgan') // todo à conserver ?

var indexRouter = require('./routes/index')
var dataBaseRouter = require('./routes/database')

var Database = require('./modules/database')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'html')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/public')))
app.engine('html', require('ejs').renderFile)

app.use('/', indexRouter)
app.use('/database', dataBaseRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// todo Trouver comment avoir un Database pour les contrôler tous
const database = new Database('memory', 'dbuser:123456@localhost:33060') // todo Mot de passe en dure... acceptable au vu du mot de passe utilisé

// Malheureusement, mysqlx ne semble pas capable de gérer plusieurs commandes en une fois
// On créée d'abord la base si elle n'existe pas
database.createSchemaIfNotExist().then((result) => {

  // Puis même chose table après table...
  database.createTablesIfNotExist()
})

module.exports = app
