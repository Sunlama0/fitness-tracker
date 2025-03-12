const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 🔹 Lien avec l'utilisateur
    workoutSession: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutSession', required: true }, // 🔹 Lien avec la séance
    name: { type: String, required: true },
    met: { type: Number, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    date: { type: Date, default: Date.now } // 🔹 Historique des exercices
});

module.exports = mongoose.model('Exercise', exerciseSchema);
