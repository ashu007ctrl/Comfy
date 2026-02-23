const express = require('express');
const { deleteAccount } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
