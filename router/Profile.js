const express = require('express');
const router = express.Router();

// @Route: api/Profile
// @desc: for profile api
// @access: private
router.get('/', (req, res) => res.send('Profile API'));

module.exports = router;