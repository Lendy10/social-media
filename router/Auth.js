const express = require('express');
const router = express.Router();

// @Route: api/Auth
// @desc: for authentication api
// @access: private
router.get('/', (req, res) => res.send('Auth API'));

module.exports = router;