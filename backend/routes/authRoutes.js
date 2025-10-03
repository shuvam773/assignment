const router = require('express').Router();

const { signup, login, logout } = require('../controllers/authCtrl');

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

module.exports = router;