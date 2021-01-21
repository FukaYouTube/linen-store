const config = require('./config')

const express = require('express')

const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')

const mongoose = require('mongoose').connect(config['URI-MONGO'], { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.then(() => console.log(`Connect to mongodb!`)).catch(error => console.log(error))

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))

app.use('/', serveStatic(path.join(__dirname, 'client/dist/')))

const routes = require('./routes')
app.use(routes)

app.listen(process.env.PORT || 8000)