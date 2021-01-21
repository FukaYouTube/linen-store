const config = require('../config')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/user.model')
const Product = require('../models/products.model')

module.exports = {
    'ADD-PRODUCTS': async (req, res) => {
        let product = await Product.findOne({ name: req.body.productInfo.name, category: req.body.productInfo.category })

        if(!product){
            product = new Product({
                file: req.body.file,
                name: req.body.productInfo.name,
                amount: req.body.productInfo.amount,
                price: req.body.productInfo.price,
                category: req.body.productInfo.category,
                description: req.body.productInfo.description,
            })
            product.save()

            res.status(200).json({ message: 'success add new products', product })
        }else{
            product.file = req.body.file
            product.amount = req.body.productInfo.amount
            product.price = req.body.productInfo.price
            product.description = req.body.productInfo.description
            product.save()

            res.status(200).json({ message: 'success update products', product })
        }
    },
    'REMOVE-PRODUCTS': (req, res) => {

    },
    'GET-USER-LIST': async (req, res) => {
        let product = await Product.find({ users: { $exists: true, $ne: [] } })
        res.status(200).json({ product })
    },
    'REMOVE-USER': async (req, res) => {
        let product = await Product.findOne({ name: req.body.product.name, category: req.body.product.category })
        if(!product) return res.status(400).json({ message: 'not data' })

        product.users.splice(product.users.indexOf(product.users.find(u => u.user.username === req.body.user.user.username)), 1)
        product.save()

        res.status(200).json({ message: 'success deleted client' })
    },
    'UPDATE-ADMIN-DATA': async (req, res) => {
        console.log(req.body)
        let user = await User.findOne({ name: req.body.user.user.name })
        if(!user) return res.status(404).json({ message: 'not password or name' })

        let decrypt = bcrypt.compareSync(req.body.update.password, user.password)
        if(!decrypt) return res.status(404).json({ message: 'not password or name' })

        user.name = req.body.update.new_username
        user.password = bcrypt.hashSync(req.body.update.new_password, 14)
        user.save()

        let token = jwt.sign({ uid: user._id }, config['SECRET-KEY-TOKEN'], { expiresIn: 60*60 })
        res.status(200).json({ message: 'successful updated data', user: { uid: user._id, name: user.name, utype: user.is_admin ? '_admin' : '' }, token: `Bearar ${token}` })
    }
}