const express = require('express')
const routes = express.Router();
const version = require('./version');

routes.use("/", (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

routes.get('/', (req, res) => res.sendStatus(200));
routes.get('/version', version.getVersionData);


module.exports = routes
