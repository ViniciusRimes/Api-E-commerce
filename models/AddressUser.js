const conn = require('../db/conn')
const {DataTypes} = require('sequelize')

const AddressUser = conn.define('AddressUser',{
    associateId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    AddressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    associationDate: {
        type: DataTypes.DATE
    }
})
module.exports = AddressUser