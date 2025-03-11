const express = require('express');
const router = express.Router();

// Route de test pour les performances
router.get('/', (req, res) => {
	res.send('Page Performance - En cours de développement.');
});

module.exports = router;
