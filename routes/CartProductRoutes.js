const express = require('express')
const verifyToken = require('../helpers/verifyToken')
const CartProductController = require('../controllers/CartProductController')
const router = express.Router()

router.post('/addcart/product/:productId', verifyToken, CartProductController.addProductInCart)
router.post('/addqty/:productId', verifyToken, CartProductController.addQty)
router.delete('/decreaseqty/:productId', verifyToken, CartProductController.decreaseQty)
router.delete('/removeproduct/:productId', verifyToken, CartProductController.removeProduct)
router.get('/getcart', verifyToken, CartProductController.getCart)
router.post('/checkout', verifyToken, CartProductController.checkout)
router.patch('/select/:productId', verifyToken, CartProductController.selectItems)

module.exports = router