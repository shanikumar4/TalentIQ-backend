const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const aiRoutes = require('./routes/aiRoutes')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()
connectDB()

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://talentiq-xvql.onrender.com'
]
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL)
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''))
}

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/ai', aiRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`TalentIQ server running on port ${PORT}`))
