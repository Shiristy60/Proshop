import express from 'express'
const router = express.Router()
import { getProducts, getProductById, deleteProduct } from '../controllers/productController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

// can also ve done as router.get('/', getProducts)
router.route('/').get(getProducts)
router.route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)

export default router

// now add this routes file to server.js