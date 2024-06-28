import express from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth'
import checkoutCtrl from '../controllers/checkoutCtrl'

const router = express.Router()

router.route('/')
  .get(isAuthenticated, checkoutCtrl.read)
  .post(isAuthenticated, checkoutCtrl.create)

router.route('/admin').get(isAuthenticated, authorizeRoles('admin'), checkoutCtrl.adminRead)

router.route('/:id/waybill').patch(isAuthenticated, authorizeRoles('admin'), checkoutCtrl.updateWaybill)

router.route('/:id/complete').patch(isAuthenticated, checkoutCtrl.completeOrder)

export default router