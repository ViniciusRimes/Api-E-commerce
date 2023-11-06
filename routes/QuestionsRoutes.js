const express = require('express')
const QuestionsController = require('../controllers/QuestionsController')
const router = express.Router()
const verifyToken = require('../helpers/verifyToken')
const {body} = require('express-validator')

router.post('/create/product/:id', [
    body('content').notEmpty().withMessage('O campo Conteúdo da pergunta não pode estar vazio!')
] , verifyToken ,QuestionsController.createQuestion)
router.get('/myquestions', verifyToken, QuestionsController.getMyQuestions)
router.get('/product/:id', QuestionsController.getQuestionsOfProduct)
router.delete('/delete/:id', verifyToken, QuestionsController.deleteQuestion)

module.exports = router