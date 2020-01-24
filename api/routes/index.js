import { Router } from 'express'
const router = Router()

import user from './user'
import route from './route'
import subdomain from './subdomain'
import mailgun from './mailgun'

router.use(user)
router.use(route)
router.use(subdomain)
router.use(mailgun)

export default router