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
        const createdOrder = await Order.save()
        res.status(201).json(createdOrder)
    }
})

export {
    addOrderItems
}

// import this file in orderRoutes.js
