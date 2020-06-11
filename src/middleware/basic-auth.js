function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''
    if (!authToken.toLowerCase().startsWith('basic')){
        return res.status(401).json({
            error: 'Missing basic token'
        })
    }
    req.app.get('db')('thingful')
        .where({user_name: tokenUserName})
        .first()
        .then(user => {
            if (!user || user.password !== tokenPassword){
                return res.status(401).json({
                    error: 'Unauthorized request'
                })
            }
            req.user = user
            next()
        })
        .catch(next)
}

module.exports = {
    requireAuth
}