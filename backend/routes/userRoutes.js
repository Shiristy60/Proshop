import express from 'express'
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers
} from '../controllers/userControllers.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', authUser)

router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers)
    
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

export default router

// now add this routes file to server.js