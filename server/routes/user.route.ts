import express from 'express'
import userCtrl from '../controllers/userCtrl'
import { isAuthenticated } from '../middlewares/auth'

const router = express.Router()

router.route('/register').post(userCtrl.register)
router.route('/login').post(userCtrl.login)
router.route('/logout').get(userCtrl.logout)
router.route('/refresh_token').get(userCtrl.refreshToken)
router.route('/profile').patch(isAuthenticated, userCtrl.update)
router.route('/password').patch(isAuthenticated, userCtrl.changePassword)

export default router