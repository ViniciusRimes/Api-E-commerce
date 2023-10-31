const conn = require('../db/conn')
const {DataTypes} = require('sequelize')

const Address = conn.define('Address',{
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    streetAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numberHouse: {
        type: DataTypes.STRING
    },
    zipcode: {
        type: DataTypes.STRING,
        allowNull: false
    },
})
const User = require('./User')
const AddressUser = require('./AddressUser')
Address.belongsToMany(User, {through: AddressUser})
User.belongsToMany(Address, {through: AddressUser})
module.exports = Address