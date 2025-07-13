const express = require('express');
const { addNewRoom, verfityCredentials } = require('../controllers/roomController');
const router = express.Router();

router.post('/addRoom', addNewRoom);
router.post('/verify', verfityCredentials);

module.exports = router;