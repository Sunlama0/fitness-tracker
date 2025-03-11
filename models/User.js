const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma utilisateur
const UserSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	birthDate: { type: Date, required: true },
	weight: { type: Number, required: true },
	height: { type: Number, required: true },
	dailyWaterIntake: {
		type: String,
		enum: ['1L', '2L', '3L', '4L+'],
		required: true,
	},
	goal: {
		type: String,
		enum: [
			'Perte de poids',
			'Prendre du poids',
			'Stabiliser son poids',
			'Se Muscler',
		],
		required: true,
	},
	city: { type: String, required: true },
	gender: {
		type: String,
		enum: ['Homme', 'Femme', 'Autre'],
		required: true,
	},
	dietaryPreference: {
		type: String,
		enum: ['Standard avec viande', 'Pescétarien', 'Végétarien', 'Vegan'],
		required: true,
	},
	activityLevel: {
		type: String,
		enum: ['Faible', 'Modéré', 'Élevé', 'Très Haut'],
		required: true,
	},
	initialWeight: { type: Number, required: true },
	targetWeight: { type: Number, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	date: { type: Date, default: Date.now },
});

// Hachage du mot de passe avant l'enregistrement
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log("🟢 Hachage dans le modèle User :", this.password); // DEBUG
        next();
    } catch (err) {
        next(err);
    }
});


module.exports = mongoose.model('User', UserSchema);
