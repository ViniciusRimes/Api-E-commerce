const jwt = require('jsonwebtoken')
const User = require('../models/User')
const getToken = require('./getToken');
const Enterprise = require('../models/Enterprise');
async function getOneUserByToken(req, res) {
    const token = await getToken(req, res);
    if (!token) {
        return res.status(401).json({ message: 'Token não encontrado ou inválido!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Token não encontrado ou inválido!' });
        }

        const userId = decoded.id;
        const userExists = await User.findOne({ where: { id: userId } });

        if (!userExists) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return;
        }

        return userExists
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro ao processar sua solicitação', error });
    }
}

module.exports = getOneUserByToken;
