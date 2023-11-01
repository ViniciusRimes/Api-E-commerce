const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const verifyToken = require('../helpers/verifyToken')
const {body} = require('express-validator')
const imageUpload = require('../helpers/uploadImages')

router.post('/create', imageUpload.array('images') ,[
    body('name').notEmpty().withMessage('O campo Nome não pode estar vazio!'),
    body('price').notEmpty().withMessage('O campo Preço não pode estar vazio!'),
    body('qty').notEmpty().withMessage('O campo Quantidade não pode estar vazio!'),
    //body('images').notEmpty().withMessage('O campo Imagens não pode estar vazio!'),
    body('category').notEmpty().withMessage('O campo Categoria não pode estar vazio!'),
] , verifyToken, ProductController.createProduct)
router.patch('/edit/:id', verifyToken, ProductController.editProduct)
router.delete('/delete/:id', verifyToken, ProductController.deleteProduct)


module.exports = router