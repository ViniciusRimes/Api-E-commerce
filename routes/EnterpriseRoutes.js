const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const EnterpriseController = require('../controllers/EnterpriseController')
const verifyToken = require('../helpers/verifyToken')

router.post('/register', [
    body('name').notEmpty().withMessage('O campo Nome não pode estar vazio!'),
    body('email').notEmpty().withMessage('O campo Email não pode estar vazio!'),
    body('password').notEmpty().withMessage('O campo Senha não pode estar vazio!'),
    body('confirmPassword').notEmpty().withMessage('O campo Confirmar Senha não pode estar vazio!'),
    body('phone').notEmpty().withMessage('O campo Telefone não pode estar vazio!')
], EnterpriseController.register)
router.post('/login', [
    body('email').notEmpty().withMessage('O campo Email não pode estar vazio!'),
    body('password').notEmpty().withMessage('O campo Senha não pode estar vazio!')
], EnterpriseController.login)
router.patch('/addcolaborator', [
    body('fullName').notEmpty().withMessage('O campo Nome não pode estar vazio!'),
    body('email').notEmpty().withMessage('O campo Email não pode estar vazio!'),
    body('cpf').notEmpty().withMessage('O campo CPF não pode estar vazio!'),
    body('phone').notEmpty().withMessage('O campo Telefone não pode estar vazio!')
], verifyToken, EnterpriseController.relationship)
router.delete('/delete', verifyToken, EnterpriseController.deleteEnterprise)

module.exports = router