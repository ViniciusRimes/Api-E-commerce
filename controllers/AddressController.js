const { validationResult } = require('express-validator')
const Address = require('../models/Address')
const AddressUser = require('../models/AddressUser')
const getUserByToken = require('../helpers/getUserByToken')

module.exports = class AddressController{
    static async addAddress(req, res){
        try{
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
            const addressExists = await Address.findOne({where: {country: country, state: state, city: city, streetAddress: streetAddress, zipcode: zipcode, numberHouse: numberHouse}})
            
            if(addressExists){
                const addressUserExists = await AddressUser.findOne({where: {AddressId: addressExists.id, UserId: user.id}})
                
                if(addressUserExists){
                    res.status(400).json({message: 'Você já cadastrou um endereço igual a este, crie outro e tente novamente!'})
                    return
            }}
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
        try{
            const user = await getUserByToken(req, res)
            const addressUserExists = await AddressUser.findOne({where: {AddressId: req.params.addressId, UserId: user.id}})
            if(!addressUserExists){
                res.status(400).json({message: 'Este endereço não foi encontrado ou já foi exclúido!'})
                return
            }
                await AddressUser.destroy({where: {AddressId: req.params.addressId, UserId: user.id}})
            res.status(200).json({message: 'Endereço removido da sua conta!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error})
            console.log(error)
        }
    }
    static async getAllAddressUser(req, res){
        try{
            const user = await getUserByToken(req, res)
            const addressUserExists = await AddressUser.findAll({where: {UserId: user.id}})
            if(addressUserExists.length === 0){
                res.status(404).json({message:'Nenhum endereço cadastrado, cadastre um e tente novamente!'})
                return
            }
            const addressIds = addressUserExists.map((address)=>address.AddressId)
            const addresses = await Address.findAll({where: {id: addressIds}})
            res.status(200).json({message: {addressUser: addresses, user: user}})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error})
            console.log(error)
        }
    }
    static async editAddressUser(req, res){
        try{
            const {country, state, city, streetAddress, zipcode, numberHouse} = req.body
            const user = await getUserByToken(req, res)
            const addressUser = await AddressUser.findOne({where: {AddressId: req.params.addressId, UserId: user.id}})
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
                if(!existingAddress){
                    await Address.create(newAddress)
                    await AddressUser.create({AddressId: newAddress.id, UserId: user.id, associationDate: new Date()})
                    await AddressUser.destroy({where: {AddressId: req.params.addressId, UserId: user.id}})
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
        try{
            const user = await getUserByToken(req, res)
            const addressExists = await AddressUser.findOne({where: {
                AddressId: req.params.addressId, UserId: user.id
            }})
            if(!addressExists){
                res.status(404).json({message: 'Endereço não encontrado!'})
                return
            }
            const address = await Address.findOne({where: {id: addressExists.AddressId}})
            res.status(200).json({message: {address: address, user: user}})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error})
            console.log(error)
        }
    }
}