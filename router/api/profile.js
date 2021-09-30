const express = require('express');
const router = express.Router();
const auth = require('./../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator');
const Profile = require('./../../model/ProfileModel');
const User = require('./../../model/UsersModel');
const request = require('request');
const config = require('config')

// URL GET api/profile/me
// access modifier private
// desc: for get profile
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.id
        })

        if (!profile) {
            return res.status(400).json({
                msg: "profile doesnt exist"
            })
        }

        return res.status(200).json(profile)
    } catch (err) {
        res.status(500).json({
            error: "Something goes wrong"
        });
        console.error(err);
    }
})


// URL POST api/profile/me
// access modifier private
// desc: for update or create user profile
router.post('/me', [auth, [
    check('status').not().isEmpty().withMessage('Status is required'),
    check('skills').not().isEmpty().withMessage('Skills is required')
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            })
        }

        const {
            company,
            location,
            website,
            status,
            skills,
            bio,
            githubUsername,
            youtube,
            Instagram,
            Facebook,
            LinkedIn,
            twitter
        } = req.body;

        profileObj = {};
        profileObj.user = req.id;
        profileObj.status = status;
        profileObj.skills = skills.split(',').map(item => item.trim());

        if (company) profileObj.company = company;
        if (location) profileObj.location = location;
        if (website) profileObj.website = website;
        if (bio) profileObj.bio = bio;
        if (githubUsername) profileObj.githubUsername = githubUsername

        profileObj.social = {};
        if (youtube) profileObj.social.youtube = youtube;
        if (Instagram) profileObj.social.Instagram = Instagram;
        if (Facebook) profileObj.social.Facebook = Facebook;
        if (LinkedIn) profileObj.social.LinkedIn = LinkedIn;
        if (twitter) profileObj.social.twitter = twitter;

        //grab profile data
        let profile = await Profile.findOne({
            user: profileObj.user
        });

        //new user. save to db
        if (!profile) {
            profile = await new Profile(profileObj);
            await profile.save();
        }

        //if profile exist
        profile = await Profile.findOneAndUpdate({
            user: profileObj.user
        }, {
            $set: profileObj
        }, {
            new: true
        });

        return res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({
            msg: "Something goes wrong, try again later"
        });
        console.error(err);
    }
})

// URL GET api/profile
// access modifier public
// desc: for get all profile
router.get('/', async (req, res) => {
    try {
        const profile = await Profile.find().populate('user', ['username', 'avatar']);
        if (!profile) res.status(400).json({
            msg: "There is no profile to acquire"
        });
        res.status(200).json(profile);
    } catch (err) {
        res.status(400).json({
            msg: "There is no profile to acquire"
        })
        console.error(err);
    }
})

// URL GET api/profile/user/:used_id
// access modifier protected
// desc: for get a user, must be logged in
router.get('/user/:user_id', auth, async (req, res) => {
    try {
        const verify = await User.findById(req.id).select('username');
        if (!verify) res.status(403).json({
            msg: "Login first please"
        });

        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['username', 'avatar']);
        console.log(profile);

        if (!profile) res.status(400).json({
            msg: "user not found"
        })

        return res.status(200).json(profile);
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).json({
                msg: "User not found"
            });
        }
        res.status(500).send('Server error');
    }
})

// URL DELETE api/profile
// access modifier private
// desc: delete profile, post, user
router.delete('/', auth, async (req, res) => {
    try {
        const profile = await User.findById(req.id);
        if (!profile) res.status(403).send('User not authorize');

        //delete post

        //delete profile
        await Profile.findOneAndRemove({
            user: req.id
        });

        //delete user
        await User.findOneAndRemove({
            _id: req.id
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// URL PUT api/profile/experience
// access modifier protected
// desc: add experince
router.put('/experience', [auth,
    [check('title').not().isEmpty().withMessage('Title must not be empty'),
        check('location').not().isEmpty().withMessage('Location must not be empty'),
        check('description').not().isEmpty().withMessage('Description must not be empty')
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()
        })
    }

    const user = req.id;

    //destructuring
    const {
        title,
        company,
        location,
        start_date,
        end_time,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        start_date,
        end_time,
        current,
        description
    }

    try {
        const userInfo = await Profile.findOne({
            user
        });

        if (!userInfo) return res.status(400).json({
            msg: "No Data to Display!!"
        });

        userInfo.experience.unshift(newExp);

        await userInfo.save();

        res.status(200).json(userInfo);
    } catch (err) {
        console.error(err);
        return res.status(500).send('server error');
    }
})

// URL DELETE api/profile/experience/:exp_id
// access modifier protected
// desc: add experince
router.delete('/experience/:exp_id', auth, async (req, res) => {
    const user = req.id;
    try {
        const userProfile = await Profile.findOne({
            user
        });

        if (!userProfile) res.status(400).json({
            msg: "You are not authorized"
        });

        await userProfile.experience.pull({
            _id: req.params.exp_id
        });

        await userProfile.save()

        res.status(200).json(userProfile);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
})

// URL PUT api/profile/education
// access modifier protected
// desc: add education
router.put('/education', [auth,
    [check('school').notEmpty().withMessage('School/University must not be empty'),
        check('degree').notEmpty().withMessage('Degree must not be empty'),
        check('from').notEmpty().withMessage('Your enterance year must not be empty'),
        check('description').notEmpty().withMessage('Description must not be empty')
    ]
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) res.status(400).json({
        msg: errors.array()
    });

    const user = req.id;

    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEducation = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    }

    try {
        const userProfile = await Profile.findOne({
            user
        });

        if (!userProfile) {
            return res.status(400).json({
                msg: "You are not authorized"
            });
        }

        userProfile.education.unshift(newEducation);

        await userProfile.save();

        res.status(200).json(userProfile);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
})

// URL DELETE api/profile/education/id
// access modifier protected
// desc: add education
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const userInfo = await Profile.findOne({
            user: req.id
        });

        if (!userInfo) res.status(400).json({
            msg: "You are not authorized"
        });

        await userInfo.education.pull({
            _id: req.params.edu_id
        })

        await userInfo.save();

        return res.status(200).json(userInfo);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
})

// URL GET api/profile/github/id
// access modifier protected
// desc: get github information
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Node.js'
            }
        }

        request(options, (error, response, data) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(400).json({
                    msg: "No Github Profile existed!"
                })
            }
            return res.json(JSON.parse(data));
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
})

module.exports = router;