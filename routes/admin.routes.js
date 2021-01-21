const config = require('../config')

const app = require('express').Router()

const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

function accessAdminPanelsInToken(req, res, next){
    let headers = req.headers['authorization']
    let token = headers && headers.split(' ')[1]

    if(!token) return res.status(403).json({ message: 'access denied' })

    jwt.verify(token, config['SECRET-KEY-TOKEN'], async (err, data) => {
        if(err) return res.status(499).json({ message: 'available denied! Possibly expired token' })

        let user = await User.findById(data.uid)
        user.is_admin ? next() : res.status(499).json({ message: 'available denied! Possibly expired token' })
    })
}

// ADMIN PANELS API
const adminModules = require('../modules/admin.module')
app.post('/api/admin/products/add', accessAdminPanelsInToken, (req, res) => adminModules['ADD-PRODUCTS'](req, res))
app.post('/api/admin/products/remove', accessAdminPanelsInToken, (req, res) => adminModules['REMOVE-PRODUCTS'](req, res))
app.post('/api/admin/user/list', accessAdminPanelsInToken, (req, res) => adminModules['GET-USER-LIST'](req, res))
app.post('/api/admin/user/remove', accessAdminPanelsInToken, (req, res) => adminModules['REMOVE-USER'](req, res))
app.post('/api/admin/edit', accessAdminPanelsInToken, (req, res) => adminModules['UPDATE-ADMIN-DATA'](req, res))

module.exports = app