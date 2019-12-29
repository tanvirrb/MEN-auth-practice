const express = require('express')
const connectDB = require('./config/db')
const app = express()
connectDB()

app.use(express.json({extended: false}))

app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))