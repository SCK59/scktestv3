'use strict'

const express = require('express')
const routes = require('./src/routes')

// Configure app
const app = express()

// Register our routes in app
app.use('/', routes);

app.listen(process.env.PORT || 8081)

module.exports = app
