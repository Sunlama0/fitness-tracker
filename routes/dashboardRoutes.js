const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect('/auth/login');
	}
	res.render('dashboard', { user: req.user });
});

module.exports = router;
