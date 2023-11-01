const User = require('../models/User')
const {validationResult} = require('express-validator')
const bcryptjs = require('bcryptjs')
const createToken = require('../helpers/createToken')
const getUserByToken = require('../helpers/getUserByToken')
module.exports = class UserController{
    static async register(req, res){
        const {firstName, lastName, email, password, confirmPassword, cpf, phone, isAdmin} = req.body

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: {errors: errors.array()}})
            return
        }
        if(password !== confirmPassword){
            res.status(400).json({message: 'As senhas devem ser iguais' })
            return
        }
        
        const salt = bcryptjs.genSaltSync(10)
        const passwordHash = bcryptjs.hashSync(password, salt)

        const userExists = await User.findOne({where: {email: email}})
        
        if(userExists){
            res.status(400).json({message: 'Já existe uma conta cadastrada com esse e-mail, utilize outro e tente novamente!'})
            return
        }
        const documentExists = await User.findOne({where: {cpf: cpf}})
        if(documentExists){
            res.status(400).json({message: 'Já existe uma conta cadastrada com esse cpf, utilize outro e tente novamente!'})
            return
        }
        const user = {
            firstName: firstName,
            lastName: lastName,
            fullName: firstName + ' ' + lastName,
            email: email,
            password: passwordHash,
            cpf: cpf,
            phone: phone,
            isAdmin: isAdmin
        }
        try{
            await User.create(user)
            res.status(201).json({message: 'Usuário cadastrado!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error})
        }
    }
    static async login(req, res){
        const {email, password} = req.body
        
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: {errors: errors.array()}})
            return
        }
        const userExists = await User.findOne({where: {email: email}})
        if(!userExists){
            res.status(400).json({message: 'Nenhum usuário foi encontrado com este e-mail. Utilize outro e-mail ou cadastre-se!'})
            return
        }
        const passwordCompare = bcryptjs.compareSync(password, userExists.password)
        if(!passwordCompare){
            res.status(400).json({message: 'Senha incorreta!'})
            return
        }
        try{
            await createToken(userExists, 'Usuário logado!', req, res)
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error})
        }
    }
    static async getUser(req, res){
        const user = await getUserByToken(req, res)
        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            cpf: user.cpf,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        try{
            res.status(200).json({message: {user: userResponse}})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error})
        }
    }
    static async editUser(req, res){
        const id = req.params.id
        const {firstName, lastName, email, password, cpf, phone} = req.body
        
        const userExists = await User.findOne({where: {id: id}})
        
        if(!userExists){
            res.status(400).json({message: 'Nenhum usuário foi encontrado com este e-mail. Utilize outro e-mail ou cadastre-se!'})
            return
        }
        let passwordHash
        if(password !== undefined && password !== userExists.password){
            const salt = bcryptjs.genSaltSync(10)
            passwordHash = bcryptjs.hashSync(password, salt)
        }
        
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHash || userExists.password,
            cpf: cpf,
            phone: phone
        }
        function getFullName(firstName, lastName, userExists) {
            if (!firstName && !lastName) {
                return userExists.fullName; 
            } else if (!firstName) {
                return `${userExists.firstName} ${lastName}`;
            } else if (!lastName) {
                return `${firstName} ${userExists.lastName}`;
            } else {
                return `${firstName} ${lastName}`;
            }
        }
        user.fullName = getFullName(firstName, lastName, userExists)
        try{
            await User.update(user, {where: {id: id}})
            res.status(200).json({message: 'Usuário atualizado!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error})
        }
    }
    static async deleteUser(req, res){
        const id = req.params.id
        const userExists = await User.findOne({where: {id: id}})
        
        if(!userExists){
            res.status(400).json({message: 'Nenhum usuário foi encontrado com este e-mail. Utilize outro e-mail ou cadastre-se!'})
            return
        }
        try{
            await User.destroy({where: {id: id}})
            res.status(200).json({message: 'Usuário deletado!'})
        }catch(error){
            res.status(400).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
}