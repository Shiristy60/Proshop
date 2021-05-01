// for cleanup
// main functionality of the routes is handled by these controllers.

import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'

// @desc        Auth user & get token
// @route       POST /api/users/login
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
            token: generateToken(user._id)
        })
    } else { //if either email or password is incorrect
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc        Register a new user
// @route       POST /api/users
// @access      Public
const registerUser = asyncHandler(async(req, res) => {
    // get data from body
    const { name, email, password } = req.body
    // check if the user exits
    const userExists = await User.findOne({ email })
    // if user already exists
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    // else create new user
    const user = await User.create({
        name,
        email,
        password 
    })
    // if user gets created
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc        Get user profile
// @route       GET /api/users/profile
// @access      Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc        Update user profile
// @route       PUT /api/users/profile
// @access      Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name, // if user's name is changed
            user.email = req.body.email || user.email // if user's email is changed
            if (req.body.password) { // if user's password is changed
                user.password = req.body.password
        }
        const updatedUser = await user.save() // save the data
        // return the updated data
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc        Get all users, if only logged in user is an admin
// @route       GET /api/users
// @access      Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

// @desc        Delete user
// @route       Delete /api/users/:id
// @access      Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({ message: 'User removed' });
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc        Get user by id
// @route       GET /api/users/:id
// @access      Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User
        .findById(req.params.id)
        .select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc        Update user only for admin
// @route       PUT /api/users/:id
// @access      Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        user.name = req.body.name || user.name, // if user's name is changed
        user.email = req.body.email || user.email // if user's email is changed
        
        //user.isAdmin = req.body.isAdmin || user.isAdmin doesn't work.
        /* what if the admin wants to change an admin to not being an admin? 
        In that case, req.body.isAdmin will be false.  Now, if req.body.isAdmin is false, it
        will just default to user.isAdmin.  user.isAdmin is going to be able to get assigned the value in 
        req.body.isAdmin only if req.body.isAdmin is true. However, if an admin wants to take away another 
        user's admin rights, they'd be making req.body.isAdmin false, but when the code above is reached, user.isAdmin will stay true!
        Therefore, in order to allow an admin user to take away another user's admin rights, this is used. */
        
        user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin
        const updatedUser = await user.save() // save the data
        // return the updated data
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    getUsers,
    deleteUser,
    registerUser,
    getUserProfile,
    getUserById,
    updateUser,
    updateUserProfile
}

// import this file in userRoutes.