const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser') 
const dotenv = require('dotenv');
dotenv.config();

const AuthRoute = require('./routes/auth')

mongoose.connect(process.env.mongo_url,{useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database Connection Established!')

})

const app = express();

app.use(express.json())
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

let port = 3000;

app.listen(port,()=> {
    console.log(`Server is running on port ${port}`)
})

app.use('/api/auth', AuthRoute)