const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Questions = db.define('Questions', {
    date: {
        type: DataTypes.DATE
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
const Product = require('./Product')
Product.hasMany(Questions)
const Answers = require('./Answers')
Questions.hasMany(Answers)
const User = require('./User')
User.hasMany(Questions)
module.exports = Questions