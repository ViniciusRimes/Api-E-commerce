const jwt = require('jsonwebtoken')
const User = require('../models/User')

const getToken = require('./getToken');

async function verifyIsAdmin(req, res, next) {
    const token = await getToken(req, res);
    if (!token) {
        res.status(401).json({ message: 'Token não encontrado ou inválido!' });
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        if (!decoded) {
            res.status(401).json({ message: 'Token não encontrado ou inválido!' });
            return
        }

        const userId = decoded.id;
        const userExists = await User.findOne({ where: { id: userId } });

        if (!userExists) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return
        }
        if(!userExists.isAdmin){
            res.status(401).json({message: 'Acesso negado!'})
            return
        }
        next()
    } catch (error) {
        res.status(401).json({ message: 'Erro ao processar sua solicitação', error: error });
    }
}

module.exports = verifyIsAdmin;
