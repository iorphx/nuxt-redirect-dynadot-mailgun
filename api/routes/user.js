import { Router } from 'express'
import passport from 'passport'

import { User } from '../models'

const router = Router()

router.post('/signin', passport.authenticate('local'), (req, res) => {
  req.user.password = undefined
  req.session.authUser = req.user
  res.json(req.user)
})

router.post('/signout', (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
})

export default router