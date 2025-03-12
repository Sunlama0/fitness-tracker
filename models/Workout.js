const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 🔹 Lien avec l'utilisateur
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }] // 🔹 Lien avec les exercices
});

module.exports = mongoose.model('WorkoutSession', workoutSchema);
