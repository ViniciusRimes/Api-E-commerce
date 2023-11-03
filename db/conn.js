const {Sequelize} = require('sequelize')
require('dotenv').config()
const db = new Sequelize('e_commerce_api', process.env.USER, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
})
module.exports = db