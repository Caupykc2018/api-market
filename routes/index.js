const express = require('express');
const router = express.Router();

const auth = require('./auth');
const item = require('./item');

router.use(auth);
router.use('/items', item);

module.exports = router;
