const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const Post = require('../../model/PostModel');
const Profile = require('../../model/ProfileModel');
const User = require('../../model/UsersModel');
const auth = require('../../middleware/auth');

// URL api/post
// access modifier private
// desc: for posting
router.post('/', [auth, [
    check('text').
    not().isEmpty().withMessage('Post must not be empty')
]], async (req, res) => {
    let user = req.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            TypeError: errors.array()
        })
    }

    try {
        user = await User.findById(user).select('-password');

        if (!user) {
            return res.status(400).send('User not found');
        }

        const newPost = new Post({
            user: user.id,
            text: req.body.text,
            name: user.username,
            avatar: user.avatar
        });

        const post = await newPost.save();

        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
});

// URL get api/post
// access modifier private
// desc: get all post
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({
            date: -1
        });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
})

// URL get api/post/:id
// access modifier private
// desc: get a post 
router.get('/:id', auth, async (req, res) => {
    try {
        //check if id exist
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({
                msg: "Post not found"
            });
        }

        return res.status(200).json(post);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                msg: "Post not found"
            });
        }
        console.error(err);
        return res.status(500).send('Server error');
    }
})

// URL get api/post/:id
// access modifier private
// desc: delete a post
router.delete('/:id', auth, async (req, res) => {
    try {
        //check if the one deleting is valid
        const post = await Post.findById(req.params.id);

        //check if post is exists
        if (!post) {
            return res.status(404).json({
                msg: "Post not exist"
            });
        }

        //check if logged in user is deleting
        if (post.user.toString() !== req.id) {
            res.status(401).json({
                msg: "Not Authorized"
            });
        }

        await post.remove();

        return res.status(200).json({
            msg: "Post has been removed"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
})

// URL put api/post/like/:id
// access modifier private
// desc: like a post and dislkike a post
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const likesArray = post.likes.filter(item => item.user.toString() === req.id);
        console.log(likesArray);

        if (likesArray.length > 0) {
            //jika sudah dilike maka maka unlike
            likesArray.forEach((item) => {
                post.likes.pull(item._id);
                post.save()
            });

            return res.status(200).json({
                msg: "Post is Unliked"
            });
        } else {
            post.likes.unshift({
                user: req.id
            });

            await post.save();

            return res.status(200).json({
                msg: "Post is liked"
            });
        };
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
});

// URL put api/post/comment/:id
// access modifier private
// desc: commenting on a post
router.put('/comment/:id', [auth, [
    check('comment').not().isEmpty().withMessage('Comment must not be empty')
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: errors.array()
        });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send('Post is not found');
        }

        post.comment.unshift({
            user: req.id,
            comment: req.body.comment
        });

        await post.save();

        return res.status(400).json(post);
    } catch (err) {
        if (err.kind === 4) res.status(404).send('Post is not found');
        console.error(err);
        return res.status(500).send('Server error');
    }
});

// URL delete api/post/comment/:id
// access modifier private
// desc: delete comment on a post
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        //make sure the comment is exist
        const post = await Post.findById(req.params.id);

        const comment = post.comment.find(comment => comment._id.toString() === req.params.comment_id);

        if (!comment) {
            return res.status(404).json({
                msg: "Comment not found"
            });
        }
        //make sure if the concurent user is deleting
        if (comment.user.toString() !== req.id) {
            return res.status(401).json({
                msg: "Not Authorize"
            });
        }

        //deleting the comment
        await post.comment.pull(req.params.comment_id);

        await post.save();

        return res.status(200).json({
            msg: "Comment has been deleted"
        });
    } catch (err) {
        if (err.kind == 4) {
            return res.status(404).json({
                msg: "Comment not found"
            });
        }
        console.error(err);
        return res.status(500).send('Server error');
    }
})

module.exports = router;