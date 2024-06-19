import express from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth'
import productDiscountCtrl from '../controllers/productDiscountCtrl'

const router = express.Router()

router.route('/')
  .get(isAuthenticated, authorizeRoles('admin'), productDiscountCtrl.read)
  .post(isAuthenticated, authorizeRoles('admin'), productDiscountCtrl.create)

router.route('/:id')
  .patch(isAuthenticated, authorizeRoles('admin'), productDiscountCtrl.update)
  .delete(isAuthenticated, authorizeRoles('admin'), productDiscountCtrl.delete)

export default router