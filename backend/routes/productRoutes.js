import express from 'express'
const router = express.Router()
import { getProducts, getProductById} from '../controllers/productController.js'

// can also ve done as router.get('/', getProducts)
router.route('/').get(getProducts)
router.route('/:id').get(getProductById)

export default router