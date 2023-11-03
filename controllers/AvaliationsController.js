const { validationResult } = require('express-validator')
const getUserByToken = require('../helpers/getUserByToken')
const Avaliations = require('../models/Avaliations')
const Product = require('../models/Product')
const User = require('../models/User')

module.exports = class AvaliationsController{
    static async createAvaliation(req, res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: 'Erro em processar a sua solicitação!', error: errors})
        }
        const id = req.params.id || req.body
        const {avaliationNumber, avaliationText} = req.body

        try{
            const productExists = await Product.findOne({where: {id: id}})
            if(!productExists){
                return res.status(404).json({message: 'Produto não encontrado. Tente novamente!'})
            }
            const user = await getUserByToken(req, res)

            if(avaliationNumber < 0 || avaliationNumber > 5){
                res.status(400).json({message: 'A avaliação deve ser entre 0 e 5!'})
                return
            }
            if (/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(avaliationText)) {
                res.status(400).json({ message: 'A avaliação de texto deve conter ao menos uma letra!' })
                return
            }
              

            const avaliationsExists = await Avaliations.findOne({where: {ProductId: productExists.id, UserId: user.id}})
            const avaliation = {
                avaliationNumber: avaliationNumber,
                avaliationText: avaliationText || null,
                ProductId: productExists.id,
                UserId: user.id
            }
            if(!avaliationsExists){
                await Avaliations.create(avaliation)
                res.status(201).json({message: 'Avaliação criada!'})
            }else{
                await Avaliations.update(avaliation, {where: {ProductId: productExists.id, UserId: user.id}})
                res.status(201).json({message: 'Avaliação editada!'})
            }
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error})
        }
    }
    static async getAvaliationByProduct(req, res){
        const id = req.params.id || req.body
        try{
            const productExists = await Product.findOne({where: {id: id}})
            if(!productExists){
                return res.status(404).json({message: 'Produto não encontrado. Tente novamente!'})
            }
            const avalationsProduct = await Avaliations.findAll({ where: { ProductId: id } });

            const avaliations = [];

            for (const avaliation of avalationsProduct) {
                const user = await User.findOne({where: {id: avaliation.UserId}})
                
                const avaliationObj = {
                    avaliationNumber: avaliation.avaliationNumber,
                    avaliationText: avaliation.avaliationText,
                    createdAt: avaliation.createdAt,
                    user: {
                        id: user.id,
                        name: user.fullName
                    },
                    product: {
                        id: productExists.id,
                        name: productExists.name
                    }
                }

                avaliations.push(avaliationObj)
            
            }

            res.status(200).json({ message: 'Avaliações do produto', avaliations: avaliations })
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error})
        }
    }
    static async getUserAvaliations(req, res){
        try{
            const user = await getUserByToken(req, res)
            if(!user){
                res.status(404).json({message: 'Usuário não encontrado, faça login ou cadastre-se!'})
                return
            }
            const avaliationsUser = await Avaliations.findAll({where: {UserId: user.id}})

            const avaliations = []
            for(const aval of avaliationsUser){
                const product = await Product.findOne({where: {id: aval.ProductId}})

                const userAvaliation = {
                    avaliation: {
                        avaliationId: aval.id || null,
                        avaliationText: aval.avaliationText || null,
                        avaliationNumber: aval.avaliationNumber || null,
                    },
                    user: {
                        id: user.id,
                        name: user.fullName
                    },
                    product: {
                        id: product.id,
                        name: product.name,
                        images: product.images
                    }
                }
                avaliations.push(userAvaliation)
            }
            res.status(200).json({message: 'Avaliações do usuário', avaliations: avaliations})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error})
        }
    }
}