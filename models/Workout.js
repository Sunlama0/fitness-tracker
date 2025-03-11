const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: [
            "Musculation",
            "Full Body ou Half Body",
            "Street Workout",
            "HIIT",
            "Cardio",
            "Mobilité et Stretching",
            "Entraînement Fonctionnel (CrossFit, TRX)"
        ],
        required: true
    },
    duration: { type: Number, required: true }, // en minutes
    caloriesBurned: { type: Number, required: true }, // Estimation kcal
    intensity: {
        type: String,
        enum: ["Léger", "Moyen", "Intense"],
        required: true
    },
    date: { type: Date, default: Date.now },
    notes: { type: String }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
