const { validationResult } = require('express-validator')
const Questions = require('../models/Questions')
const Product = require('../models/Product')
const getUserByToken = require('../helpers/getUserByToken')
module.exports = class QuestionsController{
    static async createQuestion(req, res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: 'Erro em processar a sua solicitação', errors: errors})
            return
        }
        const {content} = req.body
        const id = req.params.id
        try{
            const user = await getUserByToken(req, res)
            const productExists = await Product.findOne({where: {id: id}})
            const question = {
                date: new Date(),
                content: content,
                UserId: user.id,
                ProductId: productExists.id
            }
            const questionsExists = await Questions.findOne({where: {content: content, UserId: user.id, ProductId: productExists.id}})
            if(questionsExists){
                res.status(400).json({message: 'O usuário já possui uma pergunta igual a esta cadastrada!'})
                return
            }
            await Questions.create(question)
            res.status(201).json({message: 'Pergunta criada!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async deleteQuestion(req, res){
        const id = req.params.id
        const idProduct = req.query.product
        try{
            const user = await getUserByToken(req, res)
            const questionExists = await Questions.findOne({where: {id:id, UserId: user.id, ProductId: idProduct}})
            
            if(!questionExists){
                res.status(404).json({message: 'A pergunta já foi excluída ou você não possui acesso para deletá-la!'})
                return
            }
            await Questions.destroy({where: {id: questionExists.id, ProductId: questionExists.ProductId, UserId: questionExists.UserId}})
            res.status(200).json({message: 'Pergunta deletada!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async getMyQuestions(req, res){
        try{
            const user = await getUserByToken(req, res)
            const questionsInDB = await Questions.findAll({where: {UserId: user.id}})
            
            const questions = []

            for(const q of questionsInDB){
                const product = await Product.findOne({where: {id: q.ProductId}})
                
                const question = {
                    id: q.id,
                    date: q.date,
                    content: q.content,
                    createdAt: q.createdAt,
                    updatedAt: q.updatedAt,
                    product: {
                        id: product.id,
                        name: product.name
                    }
                }
                questions.push(question)
            }

            res.status(200).json({message: 'Perguntas do usuário solicitado', questions: questions})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async getQuestionsOfProduct(req, res){
        const id = req.params.id
        try{    
            const product = await Product.findOne({where: {id: id}})
            if(!product){
                return res.status(404).json({message: 'Produto não encontrado!'})
            }
            const questions = await Questions.findAll({where: {ProductId: product.id}})
            res.status(200).json({message: 'Todas as perguntas do produto', questions: questions, product: product})
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
}