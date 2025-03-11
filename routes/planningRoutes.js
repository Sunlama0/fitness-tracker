const express = require('express');
const router = express.Router();

// Route de test pour la planification
router.get('/', (req, res) => {
	res.send('Page Planning - En cours de développement.');
});

module.exports = router;
