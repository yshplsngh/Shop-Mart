import express from 'express'
import { isAuthenticated } from '../middlewares/auth'
import wishlistCtrl from '../controllers/wishlistCtrl'

const router = express.Router()

router.route('/')
  .get(isAuthenticated, wishlistCtrl.read)
  .post(isAuthenticated, wishlistCtrl.create)
  .delete(isAuthenticated, wishlistCtrl.delete)

export default router