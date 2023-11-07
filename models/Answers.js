const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Answers = db.define('Answers', {
    date: {
        type: DataTypes.DATE
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
const User = require('./User')
User.hasMany(Answers)
const Product = require('./Product')
Product.hasMany(Answers)
module.exports = Answers