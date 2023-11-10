const express = require('express')
const router = express.Router()
const {body} = require('express-validator')

const UserController = require('../controllers/UserController')
const verifyToken = require('../helpers/verifyToken')

router.post('/register', [
    body('firstName').notEmpty().withMessage(`O campo PRIMEIRO NOME não pode estar vazio`),
    body('lastName').notEmpty().withMessage(`O campo ÚLTIMO NOME não pode estar vazio`),
    body('email').notEmpty().withMessage(`O campo E-MAIL não pode estar vazio`),
    body('password').notEmpty().withMessage(`O campo SENHA não pode estar vazio`),
    body('confirmPassword').notEmpty().withMessage(`O campo CONFIRME SENHA não pode estar vazio`),
    body('cpf').notEmpty().withMessage(`O campo CPF não pode estar vazio`),
    body('phone').notEmpty().withMessage(`O campo TELEFONE não pode estar vazio`),
],  UserController.register)
router.post('/login', [
    body('email').notEmpty().withMessage(`O campo E-MAIL não pode estar vazio`),
    body('password').notEmpty().withMessage(`O campo SENHA não pode estar vazio`)
], UserController.login)
router.get('/getuser', verifyToken, UserController.getUser)
router.patch('/edituser', verifyToken, UserController.editUser)
router.delete('/deleteuser', verifyToken, UserController.deleteUser)

module.exports = router