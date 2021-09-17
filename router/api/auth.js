const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const User = require('../../model/UsersModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');

// URL api/auth
// access modifier private
// desc: for registeration
router.post('/', [
    check('username').notEmpty().withMessage('Username must not be empty'),
    check('password').notEmpty().withMessage('Password must not be empty')
], async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const user = await User.findOne({
            username
        });

        //check user exist
        if (!user) {
            res.status(400).json({
                message: "invalid credential"
            })
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({
                message: "invalid credential"
            })
        }

        //give payload
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jsonSecret'), {
            algorithm: 'HS512',
            expiresIn: '2000h'
        }, (err, token) => {
            if (err) new Error('Something goes wrong', err);
            else {
                res.status(200).json({
                    token
                })
            }
        })

    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.id).select('-password');
        if (!user) {
            res.status(400).json({
                message: "invalid credential"
            })
        }

        res.status(200).json(user);
    } catch (err) {

    }
})


module.exports = router;