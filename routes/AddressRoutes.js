const express = require('express')
const router = express.Router()
const AddressController = require('../controllers/AddressController')
const {body} = require('express-validator')
const verifyToken = require('../helpers/verifyToken')

router.post('/add', [
    body('country').notEmpty().withMessage('O campo  PAÍS não pode estar vazio'),
    body('state').notEmpty().withMessage('O campo  ESTADO não pode estar vazio'),
    body('city').notEmpty().withMessage('O campo  CIDADE não pode estar vazio'),
    body('streetAddress').notEmpty().withMessage('O campo RUA não pode estar vazio'),
    body('zipcode').notEmpty().withMessage('O campo CÓDIGO POSTAL não pode estar vazio'),
], verifyToken, AddressController.addAddress)
router.delete('/delete/:addressId', verifyToken, AddressController.deleteAddressUser)
router.get('/alladdress', verifyToken, AddressController.getAllAddressUser)
router.get('/getaddress/:addressId', verifyToken, AddressController.getAddressUserById)
router.patch('/edit/:addressId', verifyToken, AddressController.editAddressUser)

module.exports = router