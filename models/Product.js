const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Product = db.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil fugiat ex unde maiores rem. Enim dolorum eum amet eligendi. Sed laboriosam vero nostrum dolor ratione cumque aliquid omnis fugit unde'    
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    images: {
        type: DataTypes.JSON,
    },
    onDiscount: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    priceDiscount: {
        type: DataTypes.FLOAT,
    }
})
const Enterprise = require('./Enterprise')
Product.belongsTo(Enterprise)

module.exports = Product