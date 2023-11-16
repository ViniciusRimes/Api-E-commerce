const Enterprise = require('../models/Enterprise')
const User = require('../models/User')
const {validationResult} = require('express-validator')
const bcryptjs = require('bcryptjs')
const createToken = require('../helpers/createToken')
const getEnterpriseByToken = require('../helpers/getEnterpriseByToken')

const generationCnpj = ()=>{
    let randomNumber = ''
    for(let i = 0; i < 14; i++){
        randomNumber += Math.floor(Math.random() * 10)
    }
    
    return randomNumber.toString()
}
module.exports = class EnterpriseController{
    static async register(req, res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: 'Erro em processar a sua solicitação', errors: errors})
            return
        }
        const {name, email, password, confirmPassword, cnpj, phone} = req.body
        if(password !== confirmPassword){
            res.status(400).json({message: 'As senhas precisam ser iguais.'})
            return
        }
        const salt = bcryptjs.genSaltSync(10)
        const passwordHash = bcryptjs.hashSync(password, salt)

        const userExists = await Enterprise.findOne({where: {email: email}})
        if(userExists){
            res.status(400).json({message: 'Já existe um usuário cadastrado com este email, tente novamente.'})
            return
        }
        if(cnpj && cnpj.length < 14){
            res.status(400).json({message: 'O CNPJ da empresa deve ter 14 dígitos, tente novamente.'})
            return
        }
        const enterprise = {
            name,
            email,
            password: passwordHash,
            cnpj: cnpj ? cnpj : generationCnpj(),
            phone
        }
        try{
            await Enterprise.create(enterprise)
            res.status(201).json({message: 'Empresa cadastrada!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async login(req, res){
        try{
            const {email, password} = req.body
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: 'Erro em processar a sua solicitação', errors: errors})
                return
            }
            const enterpriseExists = await Enterprise.findOne({where: {email: email}})

            if(!enterpriseExists){
                res.status(400).json({message: 'Nenhum usuário está cadastrado com este email, tente novamente.'})
                return
            }
            const comparePassword = bcryptjs.compareSync(password, enterpriseExists.password)
            if(!comparePassword){
                res.status(400).json({message: 'Senha incorreta.'})
                return
            }
            await createToken({id: enterpriseExists.id, user: enterpriseExists.name}, 'Empresa logada!', req, res)
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async relationship(req, res){
        try{
            const {fullName, cpf} = req.body
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: 'Erro em processar a sua solicitação', errors: errors})
                return
            }
            const userExists = await User.findOne({where: {fullName, cpf}})
            if(!userExists){
                res.status(400).json({message: 'Nenhum usuário está cadastrado com estas informações, tente novamente.'})
                return
            }
            const enterprise = await getEnterpriseByToken(req, res)
            await User.update({isAdmin: true}, {where: {id: userExists.id}})
            await Enterprise.update({UserId: userExists.id}, {where: {id: enterprise.id}})
            res.status(200).json({message: 'Colaborador administrador adicionado!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async deleteEnterprise(req, res){
        try{
            const {password} = req.body
            const enterprise = await getEnterpriseByToken(req, res)
            if(!enterprise){
                return
            }
            const comparePassword = bcryptjs.compareSync(password, enterprise.password)
            if(!comparePassword){
                res.status(400).json({message: 'Senha incorreta'})
                return
            }
            res.status(200).json({message: 'Empresa excluída!'})
            await Enterprise.destroy({where: {id: enterprise.id}})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
}