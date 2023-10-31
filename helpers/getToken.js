function GetOneToken(req, res){
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    return token
}
module.exports = GetOneToken