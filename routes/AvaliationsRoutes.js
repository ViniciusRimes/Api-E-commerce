const express = require('express')
const AvaliationsController = require('../controllers/AvaliationsController')
const verifyToken = require('../helpers/verifyToken')
const router = express.Router()
const {body} = require('express-validator')

router.post('/create/:id', [
    body('avaliationNumber').notEmpty().withMessage('O campo Número da avaliação não pode estar vazio!')
], verifyToken, AvaliationsController.createAvaliation)
router.get('/product/:id', AvaliationsController.getAvaliationByProduct)
router.get('/myavaliations', AvaliationsController.getUserAvaliations)

module.exports = router