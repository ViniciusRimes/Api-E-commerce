const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Enterprise = db.define('Enterprise', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false 
    }
})
const User = require('./User')
Enterprise.belongsTo(User)
const Address = require('./Address')
Enterprise.belongsTo(Address)

module.exports = Enterprise