import express from 'express'
import reviewCtrl from '../controllers/reviewCtrl'
import { isAuthenticated } from '../middlewares/auth'

const router = express.Router()

router.route('/').post(isAuthenticated, reviewCtrl.create)

router.route('/eligibility/:id').get(isAuthenticated, reviewCtrl.checkReviewEligibility)

router.route('/:id').get(reviewCtrl.read)

export default router