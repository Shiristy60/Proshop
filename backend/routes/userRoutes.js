import express from 'express'
import {
    authUser,
    registerUser,
    getUserProfile
} from '../controllers/userControllers.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', authUser)
router.route('/').post(registerUser)
router.route('/profile').get(protect, getUserProfile)

export default router

// now add this routes file to server.js