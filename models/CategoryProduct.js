const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Category = db.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
const Product = require('./Product')
Category.hasMany(Product)
module.exports = Category

