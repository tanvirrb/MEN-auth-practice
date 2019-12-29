const express = require('express')
const router = express.Router()
const User  = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')

//LOGIN
router.post('/', [
    check('email', 'Enter valid email')
    .isEmail(),
    check('password', 'Password is required')
    .exists()
],
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {email, password} = req.body

    try {
        let user = await User.findOne({ email })

        if (!user){
            return res.status(400).json({errors: [{msg: "Invalid Credentials"}] })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({errors: [{msg: "Invalid Credentials"}] })
        }

        jwt.sign({id: user.id}, config.get('jwttoken'),{expiresIn: 360000}, (error, token) => {
            if (error) {
                return error
            }
            else {
                res.json({token})
            }
        })

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

module.exports = router