const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const User = require('../../model/UsersModel');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// URL api/user
// access modifier private
// desc: for registeration
router.post('/', [
    check("username").notEmpty().withMessage("username must not be empty"),
    check("email").notEmpty().withMessage("email must not be empty").isEmail().withMessage("you must input a valid email"),
    check("password").notEmpty().withMessage("password must not be empty").isLength({
        min: 6
    }).withMessage("password must be at least 6 character")
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()
            })
        }
        console.log("hello");
        const {
            username,
            email,
            password
        } = req.body;

        //check if user already registered
        let user = await User.findOne({
            email
        })

        if (user) {
            return res.status(400).json({
                error: "user already exist"
            });
        }

        //get avatar
        const avatar = gravatar.url(email, {
            s: 200,
            d: "mm",
            r: "pg"
        })

        //instansiasi
        user = await new User({
            username,
            email,
            password,
            avatar
        })

        //hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //save to db
        await user.save();

        //generate jwt
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jsonSecret'), {
            algorithm: 'HS512',
            expiresIn: '2000h'
        }, (err, token) => {
            if (err) {
                console.error(err);
                res.status(500).json({
                    message: "something went wrong, try again"
                });
            } else res.status(200).json({
                token: token
            })
        })
    } catch (err) {
        console.log(new Error("something doesnt look right", err));
    }
});


module.exports = router;