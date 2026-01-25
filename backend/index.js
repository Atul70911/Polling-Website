const mongoose = require('mongoose');
require('dotenv').config()
var cors = require('cors')

const express = require('express')
const PORT = 3000




const app = express()
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
