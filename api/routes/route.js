import { Router } from 'express'

import { Route } from '../models'

const router = Router()

router.get('/route', (req, res) => {
  Route.find({}, (err, data) => {
    if (err) return res.status(500).send(err)
    res.status(200).send(data)
  })
})

router.get('/route/:name', (req, res) => {
  Route.findOne({from: req.params.name}, (err, data) => {
    if (err) return res.status(500).send(err)
    res.status(200).send(data)
  })
})

router.post('/route', (req, res) => {
  let route = new Route(req.body.data)
  route.save(err => res.sendStatus(err ? 500 : 200))
})

router.put('/route/:id', (req, res) => {
  Route.findByIdAndUpdate(req.params.id, req.body.data, {new: true, upsert: true}, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).end()
  })
})

router.delete('/route/:id', (req, res) => {
  Route.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err)
    res.status(200).end()
  })
})

export default router