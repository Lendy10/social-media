const express = require('express');
const router = express.Router();

// @Route: api/Posts
// @desc: for post api
// @access: protected
router.get('/', (req, res) => res.send('Posts API'));

module.exports = router;