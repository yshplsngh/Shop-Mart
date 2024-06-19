import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db'
import routes from './routes'

dotenv.config({
  path: 'config/.env'
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())

app.use('/user', routes.user)
app.use('/category', routes.category)
app.use('/product', routes.product)
app.use('/productDiscount', routes.productDiscount)

connectDB()

app.listen(process.env.PORT, () => console.log(`Server is running on PORT ${process.env.PORT}`))