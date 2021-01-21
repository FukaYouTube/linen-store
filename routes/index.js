const config = require('../config')

const router = require('express').Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/user.model')
const Product = require('../models/products.model')

router.get('/api/products', async (req, res) => {
    let product = await Product.find({}, null, { sort: '-date' })
    res.status(200).json(product)
})

// AUTH
router.post('/api/auth/login', async (req, res) => {
    let user = await User.findOne({ name: req.body.username })
    if(!user) return res.status(400).json({ message: 'username not found or incorrect password' })

    let passwordUnHash = bcrypt.compareSync(req.body.password, user.password)
    if(!passwordUnHash) return res.status(400).json({ message: 'username not found or incorrect password' })

    let token = jwt.sign({ uid: user._id }, config['SECRET-KEY-TOKEN'], { expiresIn: 60*60 })
    res.status(200).json({ message: 'successful login', user: { uid: user._id, name: user.name, utype: user.is_admin ? '_admin' : '' }, token: `Bearar ${token}` })
})

// ADMIN PANELS API
const adminRoutes = require('./admin.routes')
router.use(adminRoutes)

// API METHOD
router.post('/api/products/buy', async (req, res) => {
    let product = await Product.findOne({ name: req.body.product.product.name, category: req.body.product.product.category })
    
    if(product.amount < req.body.product.amount) return res.status(400).json({ message: 'product to empty' })
    
    product.amount = product.amount - req.body.product.amount
    product.users.push({ user: req.body.user, amount: req.body.product.amount, price: req.body.product.total_price })
    product.save()

    res.status(200).json({ message: 'successful order' })
})

module.exports = router