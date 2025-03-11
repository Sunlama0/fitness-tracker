const express = require('express');
const router = express.Router();

// Route de test pour le suivi du poids
router.get('/', (req, res) => {
	res.send('Page Weight - En cours de développement.');
});

module.exports = router;
