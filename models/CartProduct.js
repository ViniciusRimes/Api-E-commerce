const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const CartProduct = db.define('CartProduct', {
    qty: {
        type: DataTypes.INTEGER
    },
    price: {
        type: DataTypes.FLOAT
    },
    totalAmountProduct: {
        type: DataTypes.FLOAT
    },
    selected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})
const CartUser = require('./CartUser')
const Product = require('./Product')
CartUser.belongsToMany(Product, {through: CartProduct })
Product.belongsToMany(CartUser, {through: CartProduct })

module.exports = CartProduct