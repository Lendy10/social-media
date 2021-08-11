const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const User = require('../model/UserModel');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

// @url api/users
// @access modifier public
//  @desc for test useer
router.post('/', [
    check('username', 'Username must not be empty').notEmpty(),
    check('email').isEmail().withMessage('Please provide a valid email').notEmpty().withMessage('Email must not be empty'),
    check('password').notEmpty().withMessage('Password must not be empty').isLength({
        min: 6
    }).withMessage('Password field must be minimum of 6 character')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    };

    const {
        username,
        email,
        password
    } = req.body;

    try {
        //see if user exist
        let user = await User.findOne({
            email: email
        });

        if (user) {
            res.status(400).json({
                errors: "User already exists.."
            });
        }

        //get gravatar
        const avatar = gravatar.url(email, {
            s: 200,
            r: "pg",
            d: "mm"
        });

        //instansiasi objek user
        user = await new User({
            username,
            email,
            avatar,
            password
        })

        //encrypt password with bcrypt
        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt);

        //save to db
        await user.save();

        //return jwt
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jsonSecret'), {
                algorithm: "HS512",
                expiresIn: "2h"
            },
            (err, token) => {
                if (err) new Error("something goes wrong", err);
                else {
                    res.json({
                        token
                    });
                }
            });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})

router.post('/user-account', [
    check('username').notEmpty().withMessage('Username is not valid'),
    check('token').isLength({
        min: 7,
        max: 9
    })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    res.send(req.body);
})

router.get('/', (req, res) => {
    res.send({
        "name": "Lendy",
        "email": "lendy10@mail.com"
    })
})

module.exports = router;