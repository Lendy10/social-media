const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: 'String',
    },
    location: {
        type: 'String',
    },
    website: {
        type: 'String'
    },
    status: {
        type: 'String',
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: 'String'
    },
    githubUsername: {
        type: 'String'
    },
    experience: [{
        title: {
            type: 'String',
        },
        company: {
            type: 'String',
        },
        location: {
            type: 'String',
        },
        start_date: {
            type: 'Date',
        },
        end_time: {
            type: 'Date',
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: 'String'
        }
    }],
    education: [{
        school: {
            type: 'String',
        },
        degree: {
            type: 'String',
        },
        fieldOfStudy: {
            type: 'String',
        },
        from: {
            type: 'Date',
        },
        to: {
            type: 'Date'
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: 'String',
        }
    }],
    social: {
        youtube: {
            type: 'String'
        },
        Instagram: {
            type: 'String'
        },
        Facebook: {
            type: 'String'
        },
        LinkedIn: {
            type: 'String'
        },
        twitter: {
            type: 'String'
        }
    },
    date: {
        type: 'Date',
        default: Date.now
    }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema);