// for cleanup
// main functionality of the routes is handled by these controllers.

import User from '../models/UserModel.js'
import asyncHandler from 'express-async-handler'

// @desc        Auth user & get token
// @route       post /api/users/login
// @access      Public
const authUser = asyncHandler(async(req, res) => {
    // get data from body
    const { email, password } = req.body
    // check if the user exits
    const user = await User.findOne({ email })
    // if user exists and password matches with the store password
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: null
        })
    } else { //if wither email or password is incorrect
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

export {
    authUser
}

// import this file in userRoutes.