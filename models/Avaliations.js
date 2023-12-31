const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Avaliations = db.define('Avaliations', {
    avaliationNumber: {
        type: DataTypes.INTEGER
    },
    avaliationText: {
        type: DataTypes.STRING
    }
})
const Product = require('./Product')
Product.hasMany(Avaliations)
const User = require('../models/User')
User.hasMany(Avaliations)
module.exports = Avaliations