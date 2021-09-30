const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }],
    comment: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        comment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }],
    Date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('posts', PostSchema);