const jwt = require('jsonwebtoken')
const getToken = require('../helpers/getToken')
require('dotenv').config()

//VERIFICA SE TEM USUÁRIO LOGADO E SE O MESMO POSSUI UM TOKEN VALIDO
async function verifyOneToken(req, res, next){
    const token = await getToken(req)
    if(!token){
        res.status(401).json({message: 'Acesso negado, entre com sua conta para acessar!'})
        return
    }
    jwt.verify(token,process.env.SECRET, function(error){
        if(error){
            res.status(403).json({message: 'Token inválido'})
        }else{
            next()
        }
        
    })
    
}
module.exports = verifyOneToken