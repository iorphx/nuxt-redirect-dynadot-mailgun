require('dotenv').config()

import express from 'express'
import passport from 'passport'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'

const MongoStore = require('connect-mongo')(session)
const app = express()

mongoose.connect(process.env['MONGO_URL'], {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise

app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
  secret: process.env['SESSION_SECRET'],
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize())
app.use(passport.session())

require('./auth_config')(passport)

import router from './routes'

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

app.use('/api', router)

module.exports = app