const mongoose = require('mongoose')

// data:           Object, // Дополнительные параметры

const product = new mongoose.Schema({
    file:           [], // Фото товара
    name:           String, // Нозвание товара
    amount:         Number, // Количество товара
    price:          Number, // Цена
    category:       String, // Категория
    description:    String, // Описание товара

    users:          [{}],
    
    date:           { type: Date, default: Date.now }
})

module.exports = mongoose.model('Product', product)