import express from 'express'
import cartCtrl from './../controllers/cartCtrl'
import { isAuthenticated } from './../middlewares/auth'

const router = express.Router()

router.route('/')
  .get(isAuthenticated, cartCtrl.read)
  .post(isAuthenticated, cartCtrl.create)
  .patch(isAuthenticated, cartCtrl.update)
  .delete(isAuthenticated, cartCtrl.delete)

router.route('/selected').patch(isAuthenticated, cartCtrl.updateSelected)

router.route('/selected/bulk').patch(isAuthenticated, cartCtrl.bulkUpdateSelected)

export default router