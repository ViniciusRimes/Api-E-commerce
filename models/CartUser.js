const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const CartUser = db.define('CartUser', {

})
const User = require('./User')
CartUser.belongsTo(User)

module.exports = CartUser
