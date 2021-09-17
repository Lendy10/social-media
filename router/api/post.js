const express = require('express');
const router = express.Router();

// URL api/post
// access modifier public
// desc: for posting
router.get('/', (req, res) => res.send("Post API"));

module.exports = router;