import express from 'express'
import productCtrl from '../controllers/productCtrl'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth'

const router = express.Router()

router.route('/')
  .get(productCtrl.read)
  .post(isAuthenticated, authorizeRoles('admin'), productCtrl.create)

router.route('/:id')
  .get(productCtrl.readById)
  .patch(isAuthenticated, authorizeRoles('admin'), productCtrl.update)
  .delete(isAuthenticated, authorizeRoles('admin'), productCtrl.delete)

export default router