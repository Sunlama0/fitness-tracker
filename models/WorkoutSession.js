const mongoose = require('mongoose');

const WorkoutSessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true }, // Nom de la séance
    date: { type: Date, default: Date.now }, // Date de l'entraînement
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }] // Liste des exercices
});

module.exports = mongoose.model('WorkoutSession', WorkoutSessionSchema);
