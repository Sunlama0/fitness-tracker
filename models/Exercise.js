const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutSession', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    met: { type: Number, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
