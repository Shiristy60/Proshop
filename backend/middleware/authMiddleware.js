import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'

// validates the token
const protect = asyncHandler(async (req, res, next) => {
    let token
    // if there exists a token and it starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // extract the token
            token = req.headers.authorization.split(' ')[1]
            // When you make a claim using a JWT, it's signed off by a server that has a secret key. The server 
            // reading the key can easily verify that the claim is valid, even without knowing the secret that was 
            // used.
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // find the user with this id and return its details, except the password
            req.user = await User.findById(decoded.id).select('-password')
            // the next function is a function in the Express router which, when invoked, executes the 
            // middleware succeeding the current middleware.
            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }       
})

// checks if current user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

export {
    protect,
    admin
}