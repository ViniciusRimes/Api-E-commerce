const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const EnterpriseController = require('../controllers/EnterpriseController')
const verifyAdmin = require('../helpers/verifyAdmin')

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
], verifyAdmin, EnterpriseController.relationship)
router.delete('/delete', verifyAdmin, EnterpriseController.deleteEnterprise)

module.exports = router