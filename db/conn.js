const {Sequelize} = require('sequelize')
const db = new Sequelize('e_commerce_api', 'root', '16042003', {
    host: 'localhost',
    dialect: 'mysql'
})
module.exports = db