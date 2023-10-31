const jwt = require('jsonwebtoken')
const getToken = require('./getToken');
const Enterprise = require('../models/Enterprise');
async function getOneEnterpriseByToken(req, res) {
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
        const enterpriseExists = await Enterprise.findOne({ where: { id: userId } });

        if (!enterpriseExists) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return;
        }

        return enterpriseExists
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro ao processar sua solicitação', error });
    }
}

module.exports = getOneEnterpriseByToken;
