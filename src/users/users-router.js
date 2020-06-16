const express = require('express')
const path = require('path')
const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, name) => {
        const {password, user_name, full_name, nickname} = req.body
        for (const field of ['full_name', 'user_name', 'password'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing ${field} in request body`
                })
            const passwordError = UsersService.validatePassword(password)

            if(passwordError)
                return res.status(400).json({
                    error: passwordError
                })
        UserService.hasUserWithUserName(
            req.app.get('db'),
            user_name
        )
            .then(hasUserWithUserName => {
                if (hasUserWithUserName){
                    return res.status(400).json({error: `Username already exists!`})
                }
                return UsersService.hashPassword(password)
                .then(hashPassword => {
                    const newUser = {
                    user_name,
                    password,
                    full_name,
                    nickName,
                    date_created: 'now()'
                }
                return UserService.insertUser(
                    req.app.get('db'),
                    newUser
                )
                .then(user => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl), `/${user.id}`)
                        .json(UserService.serializeUser(user))

                })
                })
                
            })
        .catch(next)
        
    })


module.exports = usersRouter