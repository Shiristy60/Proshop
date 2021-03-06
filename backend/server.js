import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}

// lets the app use the json data from the body
app.use(express.json())

app.get('/', (req, res) => {
   res.send('API is running....') 
})

app.use('/api/products', productRoutes) // use productRoutes file for any url that goes through /api/products
app.use('/api/users', userRoutes)   // use userRoutes file for any url that goes through /api/users
app.use('/api/orders', orderRoutes)   // use userRoutes file for any url that goes through /api/users
app.use('/api/upload', uploadRoutes)  

// when we are ready to do our payment, we will hit this route and fetch the client id.
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

// make uploads folder static so that it can loaded in the browser
// __dirname - current directory

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// middlewares
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))