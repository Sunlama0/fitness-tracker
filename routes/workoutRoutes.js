const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

// 📌 Route pour afficher le formulaire de création d'une séance (PLACÉ AVANT `/:sessionId`)
router.get('/add', ensureAuthenticated, workoutController.showAddSessionPage);
router.post('/add', ensureAuthenticated, workoutController.createSession);

// 📌 Voir toutes les séances
router.get('/', ensureAuthenticated, workoutController.getAllSessions);

// 📌 Voir une séance spécifique et ses exercices
router.get('/:sessionId', ensureAuthenticated, workoutController.getSessionDetails);

// 📌 Modifier une séance
router.get('/:sessionId/edit', ensureAuthenticated, workoutController.showEditSessionPage);
router.post('/:sessionId/edit', ensureAuthenticated, workoutController.updateSession);

// 📌 Supprimer une séance
router.post('/:sessionId/delete', ensureAuthenticated, workoutController.deleteSession);

// 📌 Status d'une séance
router.post('/:sessionId/status', ensureAuthenticated, workoutController.updateSessionStatus);

// 📌 Ajouter un exercice à une séance
router.get('/:sessionId/exercises/add', ensureAuthenticated, workoutController.showAddExercisePage);
router.post('/:sessionId/exercises/add', ensureAuthenticated, workoutController.addExercise);

// 📌 Modifier un exercice
router.post('/:sessionId/exercises/:exerciseId/edit', ensureAuthenticated, workoutController.editExercise);

// 📌 Supprimer un exercice
router.post('/:sessionId/exercises/:exerciseId/delete', ensureAuthenticated, workoutController.deleteExercise);

module.exports = router;
