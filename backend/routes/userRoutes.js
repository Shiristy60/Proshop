import express from 'express'
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser
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

router.route('/:id').delete(protect, admin, deleteUser)

export default router

// now add this routes file to server.js