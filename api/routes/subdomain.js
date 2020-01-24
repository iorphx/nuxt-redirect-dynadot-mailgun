require('dotenv').config()

import { Router } from 'express'
import axios from 'axios'

const parseString = require('xml2js').parseString
const router = Router()

async function getDNS(url) {
  return axios.get(url)
    .then(res => {
      return res.data
  })
}

router.get('/subdomain', async(req, res, next) => {
  let data = await getDNS(`https://api.dynadot.com/api3.xml?key=${process.env['DYNADOT_KEY']}&command=domain_info&domain=${process.env['DOMAIN']}`)
  parseString(data, function (err, result) {
    if (err) return res.status(500).send(err)
    res.status(200).send(result)
  })
})

router.post('/subdomain', (req, res) => {
  axios.get(`https://api.dynadot.com/api3.xml?key=${process.env['DYNADOT_KEY']}&command=set_dns2&domain=${process.env['DOMAIN']}${req.body.url}`)
    .then(response => {
      res.status(200).end()
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

export default router