import express from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth'
import categoryCtrl from '../controllers/categoryCtrl'

const router = express.Router()

router.route('/').post(isAuthenticated, authorizeRoles('admin'), categoryCtrl.create)
router.route('/').get(isAuthenticated, authorizeRoles('admin'), categoryCtrl.read)
router.route('/:id').patch(isAuthenticated, authorizeRoles('admin'), categoryCtrl.update)
router.route('/:id').delete(isAuthenticated, authorizeRoles('admin'), categoryCtrl.delete)

export default router