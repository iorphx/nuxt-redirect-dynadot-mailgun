require('dotenv').config()

import { Router } from 'express'

const mailgun = require('mailgun-js')({ apiKey: process.env['MAILGUN_KEY'], domain: process.env['DOMAIN'] });
const router = Router()

router.get('/mailgun', (req, res) => {
  mailgun.get(`/domains/${process.env['DOMAIN']}/credentials`, {skip: 1}, (error, body) => {
    if (error) return res.status(500).send(error)
    res.status(200).send(body)
  })
})

router.post('/mailgun', (req, res) => {
  mailgun.post(`/domains/${process.env['DOMAIN']}/credentials`, {login: `${req.body.name}@${process.env['DOMAIN']}`, "password": "rosua951-1"}, function (error, body) {
    if (error) return res.status(500).send(error)
    res.status(200).end()
  })
})

router.delete('/mailgun/:name', (req, res) => {
  mailgun.delete(`/domains/${process.env['DOMAIN']}/credentials/${req.params.name}`, function (error, body) {
    if (error) return res.status(500).send(error)
    res.status(200).end()
  })
})

export default router