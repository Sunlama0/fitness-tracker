module.exports = {
	ensureAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash(
			'errorMessage',
			'Veuillez vous connecter pour accéder au tableau de bord.'
		);
		res.redirect('/auth/login');
	},
};
