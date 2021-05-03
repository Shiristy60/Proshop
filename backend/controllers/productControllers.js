// for cleanup
// main functionality of the routes is handled by these controllers.

import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

// @desc        fetch all products
// @route       GET /api/products
// @access      Public
const getProducts = asyncHandler(async(req, res) => {
    
    // for pagination
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ?
        {
            name: {
                $regex: req.query.keyword,
                $options: 'i'// case insensitive
            }
        } : {}

    // total number of products
    const count = await Product.countDocuments({ ...keyword }) 
    
    // move to the respective page and display pageSize number of products
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page-1)) 
    
    // return page and number of pages
    // Math.ceil(count / pageSize) - round off number of pages
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc        Fetch single product
// @route       GET /api/products/:id
// @access      Public
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc        Delete a product
// @route       DELETE /api/products/:id
// @access      Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await product.remove()
        res.json({message: 'Product removed'})
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc        Create a product
// @route       POST /api/products/
// @access      Private/Admin
const createProduct = asyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Sample name',
        Price: 0,
        user: req.user._id,  // logged in user
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc        Update a product
// @route       PUT /api/products/:id
// @access      Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock
    } = req.body
    
    const product = await Product.findById(req.params.id)
    
    if (product) {
        // update product's info
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
    
})

// @desc        Create a review
// @route       POST /api/products/:id/reviews
// @access      Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    
    const product = await Product.findById(req.params.id)
    
    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        
        await product.save()
        res.status(201).json({ message: 'Review added'})
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
    
})

// @desc        Get top rated products
// @route       GET /api/products/top
// @access      Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)
    res.json(products)
})
export {
    getProductById,
    getProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts
}

// import this file in productRoutes.