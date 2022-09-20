const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res, next) => {
    try {
        let exitUser = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
        if (exitUser) {
            res.status(400).json({
                status: 400,
                message: 'user already exist'
            })
        } else {
            bcrypt.hash(req.body.password, 10, async function (err, hashedPass) {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                let user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashedPass
                })
                await user.save()
                res.json({
                    message: 'User added successfully',
                    data: user
                })
            })
        }

    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

const login = (req, res, next) => {
        var username = req.body.username
        var password = req.body.password

        User.findOne({$or: [{ email:username }, { phone:username }]})
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result){
                        let token = jwt.sign({id:user.id}, config.secret, {expiresIn: '2d'})
                        res.json({
                            message: 'login successful',
                            token
                        })
                    } else {
                        res.json({
                            message: 'password does not match'
                        })
                    }
                })
            } else {
                res.json({
                    message: 'no user found'
                })
            }
        })
}

const getUserDetails = async(req, res) => {
    try {
        const token = await req.header('x-auth-token')
        if (!token) return res.status(403).json({ errorMessage: "Access Denied!! No Token Provided" })
        const decoded = await jwt.verify(token, 'verySecretValue')
        let user = { name: decoded.name, mailID: decoded.mailID }
        return res.header('x-auth-token', token).status(200).json({ user })
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message || error })
    }
}

module.exports = { register, login, getUserDetails }