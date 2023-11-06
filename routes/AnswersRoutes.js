const express = require('express')
const router = express.Router()
const AnswersController = require('../controllers/AnswersController')
const verifyToken = require('../helpers/verifyToken')
const {body} = require('express-validator')

router.post('/create/question/:id', [
    body('content').notEmpty().withMessage('O campo Conteúdo da resposta não pode estar vazio!')
] , verifyToken ,AnswersController.createAnswer)
router.get('/myanswers', AnswersController.getMyAnswers)
router.get('/question/:id', AnswersController.getAnswersOfQuestion)
//necessário passar o produto por query
// exemplo url = http://localhost:5000/answers/question/5?product=3
router.delete('/delete/:id', verifyToken, AnswersController.deleteAnswer)
//necessário passar o produto por query
// exemplo url = http://localhost:5000/answers/delete/5?product=3

module.exports = router