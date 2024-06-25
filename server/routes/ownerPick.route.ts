import express from 'express'
import ownerPickCtrl from '../controllers/ownerPickCtrl'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth'

const router = express.Router()

router.route('/')
  .get(ownerPickCtrl.read)
  .post(isAuthenticated, authorizeRoles('admin'), ownerPickCtrl.create)

router.route('/:id')
  .patch(isAuthenticated, authorizeRoles('admin'), ownerPickCtrl.update)
  .delete(isAuthenticated, authorizeRoles('admin'), ownerPickCtrl.delete)

export default router