var createError = require('http-errors')
var express = require('express')
var path = require('path')
const _ = require('lodash')
var Database = require('./modules/database')

// Initialisation de la configuration avant d'appeler les routes pour transmission
const config = require('./config.json')
const defaultConfig = config.development
const environment = process.env.NODE_ENV || 'development'
const environmentConfig = config[environment]
const finalConfig = _.merge(defaultConfig, environmentConfig)
global.gConfig = finalConfig

// Initialisation de la base de données avant d'appeler les routes pour transmission
const database = new Database(global.gConfig.database, global.gConfig.db_user, global.gConfig.password, global.gConfig.host, global.gConfig.port)
global.database = database

// Malheureusement, mysqlx ne semble pas capable de gérer plusieurs commandes en une fois (todo solution à tester expliqué dans (modules\database.js))
// On créée d'abord la base si elle n'existe pas
global.database.createSchemaIfNotExist().then((result) => {

  // Puis même chose table après table...
  database.createTablesIfNotExist()
})

// Initialisation des roots
var indexRouter = require('./routes/index')
var dataBaseRouter = require('./routes/database')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'html')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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

module.exports = app
