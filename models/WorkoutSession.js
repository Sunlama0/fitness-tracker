const mongoose = require('mongoose');

const workoutSessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ["Musculation", "Full Body", "Half Body", "Street Workout", "HIIT", "Cardio", "Mobilité et Stretching", "Entraînement Fonctionnel (CrossFit, TRX)"] },
    date: { type: Date, required: true }, // 📌 Date et heure de la séance
    motivation: { type: Number, min: 1, max: 10 }, // 📌 Score de motivation (1 à 10)
    weather: { type: String, enum: ["Ensoleillé", "Nuageux", "Pluie", "Neige", "Nuit"] }, // 📌 Météo
    temperature: { type: Number }, // 📌 Température en degrés Celsius
    surface: { type: String, enum: ["Ville", "Parcours", "Mixte", "Sable", "Salle de sport", "Extérieur"] }, // 📌 Revêtement du sol
    status: { 
        type: String, 
        enum: ['À venir', 'En cours', 'Terminé'], 
        default: 'À venir' 
    },
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
    dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);
