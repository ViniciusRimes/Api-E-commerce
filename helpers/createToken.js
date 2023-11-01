const jwt = require('jsonwebtoken')
require('dotenv').config()
async function createUserToken(user, message, req, res){
    try{
        const token = jwt.sign({
            id: user.id,
            user: user.name
        }, process.env.SECRET)
        res.status(201).json({message: `${message ? message : ''} Você está autenticado!`, token: token})
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Erro em processar a sua solicitação:', error: error })
    }
}
module.exports = createUserToken