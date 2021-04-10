import express from 'express'
import {
    authUser,
} from '../controllers/userControllers.js'

const router = express.Router()

router.post('/login', authUser)

export default router

// now add this routes file to server.js