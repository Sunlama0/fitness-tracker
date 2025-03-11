const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

// 📌 Voir toutes les séances
router.get('/', ensureAuthenticated, workoutController.getAllSessions);

// 📌 Voir une séance spécifique (DÉTAILS)
router.get('/:sessionId', ensureAuthenticated, workoutController.getSessionDetails);

// 📌 Ajouter une séance
router.get('/add', ensureAuthenticated, workoutController.showAddSessionPage);
router.post('/add', ensureAuthenticated, workoutController.createSession);

// 📌 Ajouter un exercice dans une séance
router.get('/:sessionId/exercises/add', ensureAuthenticated, workoutController.showAddExercisePage);
router.post('/:sessionId/exercises/add', ensureAuthenticated, workoutController.addExercise);

// Modifier la durée d'un exercice
router.post('/:workoutId/exercises/:exerciseId/edit', workoutController.editExercise);

// Supprimer un exercice
router.get('/:workoutId/exercises/:exerciseId/delete', workoutController.deleteExercise);

module.exports = router;
