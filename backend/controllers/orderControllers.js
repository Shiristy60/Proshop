// for cleanup
// main functionality of the routes is handled by these controllers.

import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'

// @desc        Create new order
// @route       POST /api/orders
// @access      Private
const addOrderItems = asyncHandler(async(req, res) => {
    const {
        orderItems, // array of orders that is sent
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    // check if orderItems is not empty
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
    } else {
        // create a new order
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })
        // save the order into database
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
})

// @desc        Get order by id
// @route       GET /api/orders/ :id
// @access      Private
const getOrderById = asyncHandler(async(req, res) => {
    const order = await Order
        .findById(req.params.id) // id from url
        .populate('user', 'name email') // get name and email of the user that placed the order
    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc        Update order to paid
// @route       GET /api/orders/:id/pay
// @access      Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
    const order = await Order
        .findById(req.params.id) // id from url
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = { // we get these from paypal API
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save() // save in the DB
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc        Get logged in user orders
// @route       GET /api/orders/myorders
// @access      Private
const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order
        .find({ user: req.user._id })
        res.json(orders)
})

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders
}

// import this file in orderRoutes.js
