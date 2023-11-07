const { validationResult } = require('express-validator')
const Questions = require('../models/Questions')
const Product = require('../models/Product')
const Answers = require('../models/Answers')
const User = require('../models/User')
const getUserByToken = require('../helpers/getUserByToken')
const { Op } = require('sequelize')

module.exports = class AnswersController{
    static async createAnswer(req, res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: 'Erro em processar a sua solicitação', errors: errors})
            return
        }
        const {content} = req.body
        const id = req.params.id
        try{
            const user = await getUserByToken(req, res)
            const question = await Questions.findOne({where: {id: id}})
            if(!question){
                return res.status(404).json({message: 'A pergunta não foi encontrada ou foi excluída!'})
            }
            if(question.UserId === user.id){
                return res.status(400).json({message:'Você não pode responder uma pergunta que você mesmo fez!'})
            }
            const product = await Product.findOne({where: {id: question.ProductId}})

            const answer = {
                date: new Date(),
                content: content,
                UserId: user.id,
                QuestionId: question.id,
                ProductId: product.id
            }
            const answerExists = await Answers.findOne({where: {content: content, UserId: user.id, QuestionId: question.id, ProductId: product.id}})
            if(answerExists){
                res.status(400).json({message: 'Você já respondeu essa questão, pode editar a sua resposta antiga ou excluí-la e criar outra!'})
                return
            }
        
            await Answers.create(answer)
            return res.status(201).json({message: 'Resposta cadastrada!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async getMyAnswers(req, res){
        const user = await getUserByToken(req, res)
        try{
            const answersInDb = await Answers.findAll({where: {UserId: user.id}})
            const answers = []

            for(const ans of answersInDb){
                const product = await Product.findOne({where: {id: ans.ProductId}})
                const question = await Questions.findOne({where: {id: ans.id}})
                
                const answer = {
                    answer: {
                        id: ans.id,
                    date: ans.date,
                    content: ans.content,
                    },
                    question: {
                        id: question.id,
                        date: question.date,
                        content: question.content,
                    },
                    product:{
                        id: product.id,
                        name: product.name
                    }
                }
                answers.push(answer)
            }
            res.status(200).json({message: {answers: answers}})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async getAnswersOfQuestion(req, res){
        const id = req.params.id
        const query = req.query.product
        try{    
            const questionInDb = await Questions.findOne({where: {id: id, ProductId: query}})
            if(!questionInDb){
                return res.status(404).json({message: 'Pergunta não encontrada, possívelmente foi deletada!'})
            }
            const user = await User.findOne({where: {id: questionInDb.UserId}})

            const question = {
                id: questionInDb.id,
                date: questionInDb.date,
                content: questionInDb.content,
                createdAt: questionInDb.createdAt,
                user:{
                    id: user.id,
                    name: user.fullName
                }
            }
            const product = await Product.findOne({where: {id: query}})
            if(!product){
                return res.status(404).json({message: 'Produto não encontrado'})
            }
            const answers = await Answers.findAll({where: {QuestionId: question.id, ProductId: product.id}})
            res.status(200).json({message: 'Respostas da pergunta solicitada', answers: answers, question: question, product: product})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async deleteAnswer(req, res){
        const id = req.params.id
        const idProduct = req.query.product
        try{
            const user = await getUserByToken(req, res)
            const answerExists = await Answers.findOne({where: {id:id, UserId: user.id, ProductId: idProduct}})
            
            if(!answerExists){
                res.status(404).json({message: 'A resposta já foi excluída ou você não possui acesso para deletá-la!'})
                return
            }
            await Answers.destroy({where: {id: answerExists.id, ProductId: answerExists.ProductId, UserId: answerExists.UserId}})
            res.status(200).json({message: 'Resposta deletada!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
}