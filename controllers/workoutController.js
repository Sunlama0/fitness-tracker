const mongoose = require('mongoose');
const WorkoutSession = require('../models/WorkoutSession');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

// 📌 Fonction de mise à jour du statut de la séance
async function updateSessionStatus(session) {
    try {
        const now = new Date();
        const sessionDate = new Date(session.date);

        // Ne pas modifier une séance déjà "Terminée"
        if (session.status !== 'Terminé') {
            if (sessionDate.toDateString() === now.toDateString()) {
                session.status = 'En cours';
            } else if (sessionDate < now) {
                session.status = 'Terminé';
            } else {
                session.status = 'À venir';
            }

            // Sauvegarde uniquement si le statut a changé
            if (session.isModified('status')) {
                await session.save();
            }
        }
    } catch (error) {
        console.error("❌ [ERROR] Erreur lors de la mise à jour du statut :", error);
    }
}

// 📌 Afficher toutes les séances de l'utilisateur
exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await WorkoutSession.find({ user: req.user.id })
            .populate('exercises')
            .sort({ date: -1 });

        // Mettre à jour les statuts sans bloquer le rendu
        sessions.forEach(session => updateSessionStatus(session));

        res.render('workouts/index', { title: "Mes Séances", sessions });
    } catch (err) {
        console.error("❌ [ERROR] Erreur lors de la récupération des séances :", err);
        res.redirect('/');
    }
};

// 📌 Afficher les détails d'une séance spécifique
exports.getSessionDetails = async (req, res) => {
    try {
        const session = await WorkoutSession.findById(req.params.sessionId).populate('exercises');

        if (!session) {
            req.flash('error', "Séance introuvable !");
            return res.redirect('/workouts');
        }

        // Lancer la mise à jour du statut en arrière-plan
        updateSessionStatus(session);

        // Convertir la date et l'heure
        const formattedDate = session.date.toLocaleDateString();
        const formattedTime = session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        res.render('workouts/details', { session, formattedDate, formattedTime });
    } catch (err) {
        console.error("❌ [ERROR] Erreur lors de la récupération des détails :", err);
        res.redirect('/workouts');
    }
};

// 📌 Mettre à jour le statut d'une séance manuellement
exports.updateSessionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const sessionId = req.params.sessionId;

        const session = await WorkoutSession.findOneAndUpdate(
            { _id: sessionId, user: req.user._id },
            { status },
            { new: true }
        );

        if (!session) {
            req.flash('error', "Séance introuvable.");
            return res.redirect('/workouts');
        }

        req.flash('success', "✅ Statut de la séance mis à jour !");
        res.redirect(`/workouts/${sessionId}`);
    } catch (error) {
        console.error("❌ [ERROR] Erreur lors de la mise à jour du statut :", error);
        req.flash('error', "Une erreur est survenue.");
        res.redirect('/workouts');
    }
};

// 📌 Afficher la page pour créer une séance
exports.showAddSessionPage = (req, res) => {
    res.render('workouts/addSession', { title: "Créer une Séance" });
};

// 📌 Créer une nouvelle séance
exports.createSession = async (req, res) => {
    try {
        const { title, type, date } = req.body;

        if (!title || !type || !date) {
            req.flash('error', "Tous les champs sont requis !");
            return res.redirect('/workouts/add');
        }

        const newSession = new WorkoutSession({
            user: req.user._id,
            title,
            type,
            date
        });

        await newSession.save();
        req.flash('success', "✅ Séance créée avec succès !");
        res.redirect(`/workouts/${newSession._id}`);
    } catch (err) {
        console.error("❌ [ERROR] Erreur lors de la création de la séance :", err);
        req.flash('error', "Une erreur est survenue.");
        res.redirect('/workouts/add');
    }
};

exports.updateSession = async (req, res) => {
    try {
        const { motivation, weather, temperature, surface } = req.body;
        const sessionId = req.params.sessionId;

        console.log("🔄 [DEBUG] Mise à jour de la séance :", sessionId);
        console.log("⭐ [DEBUG] Motivation :", motivation);
        console.log("🌤 [DEBUG] Météo :", weather);
        console.log("🌡 [DEBUG] Température :", temperature);
        console.log("🏋 [DEBUG] Revêtement :", surface);

        // Vérifier si la séance existe bien AVANT de la modifier
        const session = await WorkoutSession.findOne({ _id: sessionId, user: req.user._id });

        if (!session) {
            console.log("❌ [ERROR] Séance introuvable !");
            req.flash('error', "Séance introuvable.");
            return res.redirect('/workouts');
        }

        // Vérification et conversion des valeurs
        const newMotivation = motivation ? parseInt(motivation, 10) : null;
        const newTemperature = temperature ? parseFloat(temperature) : null;
        const validWeather = weather || session.weather; // Garde l'ancienne valeur si vide
        const validSurface = surface || session.surface; // Garde l'ancienne valeur si vide

        // Mise à jour de la séance
        session.motivation = newMotivation;
        session.weather = validWeather;
        session.temperature = newTemperature;
        session.surface = validSurface;

        await session.save();

        console.log("✅ [SUCCESS] Séance mise à jour :", session);

        req.flash('success', "✅ Séance mise à jour avec succès !");
        res.redirect(`/workouts/${sessionId}`);
    } catch (error) {
        console.error("❌ [ERROR] Erreur lors de la modification :", error);
        req.flash('error', "Une erreur est survenue.");
        res.redirect('/workouts');
    }
};

// 📌 Afficher la page pour modifier une séance
exports.showEditSessionPage = async (req, res) => {
    try {
        const sessionId = req.params.sessionId;

        console.log("🔍 [DEBUG] Récupération de la séance pour modification - ID :", sessionId);

        // Trouver la séance associée à l'utilisateur connecté
        const session = await WorkoutSession.findOne({ _id: sessionId, user: req.user._id });

        if (!session) {
            console.log("❌ [ERROR] Séance introuvable !");
            req.flash('error', "Séance introuvable.");
            return res.redirect('/workouts');
        }

        console.log("✅ [DEBUG] Séance trouvée :", session);

        // Rendu de la page d'édition avec les données actuelles de la séance
        res.render('workouts/editSession', { title: "Modifier la Séance", session });

    } catch (err) {
        console.error("❌ [ERROR] Erreur lors de la récupération de la séance :", err);
        req.flash('error', "Une erreur est survenue.");
        res.redirect('/workouts');
    }
};

// 📌 Supprimer une séance
exports.deleteSession = async (req, res) => {
    try {
        const sessionId = req.params.sessionId;

        console.log("🗑️ [DEBUG] Suppression de la séance - ID :", sessionId);

        // Trouver la séance associée à l'utilisateur connecté
        const session = await WorkoutSession.findOne({ _id: sessionId, user: req.user._id });

        if (!session) {
            console.log("❌ [ERROR] Séance introuvable !");
            req.flash('error', "Séance introuvable.");
            return res.redirect('/workouts');
        }

        console.log("✅ [DEBUG] Séance trouvée, suppression en cours...");

        // Supprimer tous les exercices associés à cette séance
        await Exercise.deleteMany({ workoutSession: sessionId });

        // Supprimer la séance elle-même
        await WorkoutSession.findByIdAndDelete(sessionId);

        console.log("✅ [SUCCESS] Séance supprimée avec succès !");
        req.flash('success', "✅ Séance supprimée !");
        res.redirect('/workouts');

    } catch (err) {
        console.error("❌ [ERROR] Erreur lors de la suppression de la séance :", err);
        req.flash('error', "Une erreur est survenue.");
        res.redirect('/workouts');
    }
};

// 📌 Afficher la page pour ajouter un exercice
exports.showAddExercisePage = async (req, res) => {
    try {
        const session = await WorkoutSession.findById(req.params.sessionId);
        if (!session) {
            req.flash('error', "Séance introuvable.");
            return res.redirect('/workouts');
        }
        res.render('workouts/addExercise', { title: "Ajouter un Exercice", sessionId: session._id });
    } catch (err) {
        console.error("❌ [ERROR] Erreur :", err);
        res.redirect('/workouts');
    }
};

// 📌 Ajouter un exercice à une séance
exports.addExercise = async (req, res) => {
    const { name, customName, met, customMet, duration } = req.body;
    const sessionId = req.params.sessionId;

    try {
        const session = await WorkoutSession.findById(sessionId);
        if (!session) {
            req.flash('error', "Séance introuvable.");
            return res.redirect('/workouts');
        }

        let metValue = met ? parseFloat(met) : parseFloat(customMet);
        if (!metValue || metValue <= 0) {
            req.flash('error', "Veuillez entrer un MET valide.");
            return res.redirect(`/workouts/${sessionId}/exercises/add`);
        }

        const userWeight = req.user.weight || 70;
        const caloriesBurned = ((metValue * 3.5 * userWeight) / 200) * parseInt(duration, 10);
        const finalName = name === "Autre" ? customName : name;

        const newExercise = new Exercise({
            user: req.user._id,
            workoutSession: sessionId,
            name: finalName,
            met: metValue,
            duration: parseInt(duration, 10),
            caloriesBurned
        });

        await newExercise.save();
        session.exercises.push(newExercise._id);
        await session.save();

        req.flash('success', '✅ Exercice ajouté avec succès.');
        res.redirect(`/workouts/${sessionId}`);
    } catch (err) {
        console.error("❌ [ERROR] Erreur lors de l'ajout de l'exercice :", err);
        res.redirect(`/workouts/${sessionId}/exercises/add`);
    }
};

// 📌 Modifier un exercice
exports.editExercise = async (req, res) => {
    try {
        const { exerciseId } = req.params;
        const { duration } = req.body;

        const exercise = await Exercise.findOne({ _id: exerciseId, user: req.user._id });
        if (!exercise) {
            req.flash('error', "Exercice introuvable.");
            return res.redirect('/workouts');
        }

        exercise.duration = parseInt(duration, 10);
        exercise.caloriesBurned = (exercise.met * 3.5 * req.user.weight) / 200 * exercise.duration;

        await exercise.save();
        req.flash('success', "✅ Exercice mis à jour !");
        res.redirect(`/workouts/${exercise.workoutSession}`);
    } catch (error) {
        console.error("❌ [ERROR] Erreur lors de la modification :", error);
        res.redirect('/workouts');
    }
};

// 📌 Supprimer un exercice
exports.deleteExercise = async (req, res) => {
    try {
        const { exerciseId } = req.params;

        const exercise = await Exercise.findOneAndDelete({ _id: exerciseId, user: req.user._id });

        if (!exercise) {
            req.flash('error', "Exercice introuvable.");
            return res.redirect('/workouts');
        }

        await WorkoutSession.findByIdAndUpdate(exercise.workoutSession, {
            $pull: { exercises: exerciseId }
        });

        req.flash('success', "✅ Exercice supprimé !");
        res.redirect(`/workouts/${exercise.workoutSession}`);
    } catch (error) {
        console.error("❌ [ERROR] Erreur lors de la suppression :", error);
        res.redirect('/workouts');
    }
};
