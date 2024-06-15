import express from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth'
import categoryCtrl from '../controllers/categoryCtrl'

const router = express.Router()

router.route('/')
  .get(isAuthenticated, authorizeRoles('admin'), categoryCtrl.read)
  .post(isAuthenticated, authorizeRoles('admin'), categoryCtrl.create)

router.route('/search').get(isAuthenticated, authorizeRoles('admin'), categoryCtrl.search)

router.route('/:id')
  .patch(isAuthenticated, authorizeRoles('admin'), categoryCtrl.update)
  .delete(isAuthenticated, authorizeRoles('admin'), categoryCtrl.delete)

export default router