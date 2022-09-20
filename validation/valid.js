const Joi = require('joi')

const validData = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required(),
    phone: Joi.string().required().length(10).pattern(/^[0-9]+$/),
    password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$')).required(),
    
})

const userSignUp = async(req, res, next) => {
    try {
        await validData.validateAsync({...req.body }, { abortEarly: false })
        next()
    } catch (err) {
        err.status = res.status(400).json({ status: 400, message: err.message || err })
    }
}


const loginData = Joi.object({
    emailID: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$')).required()
})

const userLogin = async(req, res, next) => {
    try {
        await loginData.validateAsync({...req.body }, { abortEarly: false })
        next()
    } catch (err) {
        err.status = res.status(400).json({ status: 400, message: err.message || err })
    }
}


module.exports = { userSignUp, userLogin }