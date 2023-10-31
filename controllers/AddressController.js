const { validationResult } = require('express-validator')
const Address = require('../models/Address')
const AddressUser = require('../models/AddressUser')
const getUserByToken = require('../helpers/getUserByToken')
const { where } = require('sequelize')

module.exports = class AddressController{
    static async addAddress(req, res){
        const {country, state, city, streetAddress, zipcode, numberHouse} = req.body
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: {errors: errors.array()}})
            return
        }
        const address = {
            country: country,
            city: city,
            state: state,
            streetAddress: streetAddress,
            zipcode: zipcode,
            numberHouse: numberHouse || 'SN'
        }
        const user = await getUserByToken(req, res)
        if(!user){
            res.status(404).json({message: 'Usuário inválido ou não encontrado!'})
            return
        }
        const addressExists = await Address.findOne({where: {country: country, state: state, city: city, streetAddress: streetAddress, zipcode: zipcode, numberHouse: numberHouse}})
        
        if(addressExists){
            const addressUserExists = await AddressUser.findOne({where: {AddressId: addressExists.id, UserId: user.id}})
            
            if(addressUserExists){
                res.status(400).json({message: 'Você já cadastrou um endereço igual a este, crie outro e tente novamente!'})
                return
        }}
    
        try{
            if(!addressExists){
                const newAddress = await Address.create(address)
                await AddressUser.create({AddressId: newAddress.id, UserId: user.id, associationDate: new Date()})
            }else{
                await AddressUser.create({AddressId: addressExists.id, UserId: user.id, associationDate: new Date()})
            }
            res.status(201).json({message: 'Endereço criado com sucesso'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error})
            console.log(error)
        }
    }
    static async deleteAddressUser(req, res){
        const id = req.params.id
        const user = await getUserByToken(req, res)
        if(!user){
            res.status(404).json({message: 'Usuário inválido ou não encontrado!'})
            return
        }
        const addressUserExists = await AddressUser.findOne({where: {AddressId: id, UserId: user.id}})
        if(!addressUserExists){
            res.status(400).json({message: 'Este endereço não foi encontrado ou já foi exclúido!'})
            return
        }
        try{
            await AddressUser.destroy({where: {AddressId: id, UserId: user.id}})
            res.status(200).json({message: 'Endereço removido da sua conta!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error})
            console.log(error)
        }
    }
    static async getAllAddressUser(req, res){
        const user = await getUserByToken(req, res)
        const addressUserExists = await AddressUser.findAll({where: {UserId: user.id}})
        if(addressUserExists.length === 0){
            res.status(404).json({message:'Nenhum endereço cadastrado, cadastre um e tente novamente!'})
            return
        }
        const addressIds = addressUserExists.map((address)=>address.AddressId)
        const addresses = await Address.findAll({where: {id: addressIds}})
        try{
            res.status(200).json({message: {addressUser: addresses, user: user}})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error})
            console.log(error)
        }
    }
    static async editAddressUser(req, res){
        const {country, state, city, streetAddress, zipcode, numberHouse} = req.body
        const id = req.params.id

        const user = await getUserByToken(req, res)
        if(!user){
            res.status(404).json({message: 'Usuário inválido ou não encontrado!'})
            return
        }
        const addressUser = await AddressUser.findOne({where: {AddressId: id, UserId: user.id}})
        if(!addressUser){
            res.status(403).json({ message: 'Endereço não encontrado em sua conta'})
            return
        }
        const newAddress = {
            country: country,
            state: state,
            city: city,
            streetAddress: streetAddress,
            zipcode: zipcode,
            numberHouse: numberHouse || 'SN',
        }
        const existingAddress = await Address.findOne({where: {country: country, state: state, city: city, streetAddress: streetAddress, zipcode: zipcode, numberHouse: numberHouse || 'SN',}})
        try{
            if(!existingAddress){
                await Address.create(newAddress)
                await AddressUser.create({AddressId: newAddress.id, UserId: user.id, associationDate: new Date()})
                await AddressUser.destroy({where: {AddressId: id, UserId: user.id}})
            }else{
                await AddressUser.update({AddressId: existingAddress.id}, {where: {
                    AddressId: addressUser.AddressId,
                    UserId: user.id
                }})
            }
            res.status(200).json({message: 'Endereço atualizado!'})
            
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error})
            console.log(error)
        }
    }
    static async getAddressUserById(req, res){
        const id = req.params.id
        const user = await getUserByToken(req, res)
        if(!user){
            res.status(404).json({message: 'Usuário inválido ou não encontrado!'})
            return
        }
        const addressExists = await AddressUser.findOne({where: {
            AddressId: id, UserId: user.id
        }})
        if(!addressExists){
            res.status(404).json({message: 'Endereço não encontrado!'})
        }
        const address = await Address.findOne({where: {id: addressExists.AddressId}})
        try{
            res.status(200).json({message: {address: address, user: user}})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error})
            console.log(error)
        }
    }
}