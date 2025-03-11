const WorkoutSession = require('../models/WorkoutSession');
const Exercise = require('../models/Exercise');

// 📌 Afficher toutes les séances
exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await WorkoutSession.find({ user: req.user.id }).populate('exercises').sort({ date: -1 });
        res.render('workouts/index', { title: "Mes Séances", sessions });
    } catch (err) {
        console.error("❌ Erreur :", err);
        res.redirect('/');
    }
};

exports.getSessionDetails = async (req, res) => {
    try {
        const session = await WorkoutSession.findById(req.params.sessionId).populate('exercises');

        if (!session) {
            return res.status(404).send("Séance introuvable !");
        }

        res.render('workouts/details', { session });
    } catch (err) {
        console.error("❌ Erreur :", err);
        res.redirect('/workouts');
    }
};

// 📌 Afficher la page pour créer une séance
exports.showAddSessionPage = (req, res) => {
    res.render('workouts/addSession', { title: "Créer une Séance" });
};

// 📌 Créer une nouvelle séance
exports.createSession = async (req, res) => {
    const { title } = req.body;

    try {
        const newSession = new WorkoutSession({
            user: req.user.id,
            title
        });

        await newSession.save();
        res.redirect('/workouts');
    } catch (err) {
        console.error("❌ Erreur :", err);
        res.redirect('/workouts');
    }
};

// 📌 Afficher la page pour ajouter un exercice
exports.showAddExercisePage = (req, res) => {
    res.render('workouts/addExercise', { sessionId: req.params.sessionId });
};

function calculateCalories(met, weight, duration) {
    return ((met * 3.5 * weight) / 200) * duration;
};

// 📌 Ajouter un exercice à une séance
exports.addExercise = async (req, res) => {
    const { name, customName, met, customMet, duration } = req.body;
    const sessionId = req.params.sessionId;

    // console.log("✅ Requête reçue pour ajouter un exercice !");
    // console.log("📩 Données reçues :", req.body);
    // console.log("🔍 ID de la séance :", sessionId);

    try {
        const session = await WorkoutSession.findById(sessionId);
        if (!session) {
            console.log("❌ Séance introuvable !");
            req.flash('error', "Séance introuvable.");
            return res.redirect('/workouts');
        }

        // console.log("🎯 Séance trouvée :", session._id);

        // Vérifier et récupérer le MET
        let metValue = met ? parseFloat(met) : parseFloat(customMet);
        if (!metValue || metValue <= 0) {
            console.log("❌ MET non valide !");
            req.flash('error', "Veuillez entrer un MET valide.");
            return res.redirect(`/workouts/${sessionId}/exercises/add`);
        }

        // console.log("🔥 MET utilisé :", metValue);

        // Récupérer le poids de l'utilisateur
        const userWeight = req.user.weight || 70;
        // console.log("⚖ Poids de l'utilisateur :", userWeight, "kg");

        // Calculer les calories brûlées
        const caloriesBurned = calculateCalories(metValue, userWeight, parseInt(duration));
        // console.log("🔥 Calories brûlées :", caloriesBurned);

        // Déterminer le nom de l'exercice
        const finalName = name === "Autre" ? customName : name;

        // Sauvegarde de l'exercice
        const newExercise = new Exercise({
            session: sessionId,
            user: req.user._id,
            name: finalName,
            met: metValue,
            duration: parseInt(duration),
            caloriesBurned
        });

        // console.log("✅ Exercice en cours d'ajout :", newExercise);

        await newExercise.save();
        session.exercises.push(newExercise._id);
        await session.save();

        // console.log("🎉 Exercice ajouté avec succès !");
        req.flash('success', 'Exercice ajouté avec succès.');
        res.redirect(`/workouts/${sessionId}`);
    } catch (err) {
        console.error("❌ Erreur lors de l'ajout de l'exercice :", err);
        req.flash('error', "Erreur lors de l'ajout de l'exercice.");
        res.redirect(`/workouts/${sessionId}/exercises/add`);
    }
};

// Modifier un exercice
exports.editExercise = async (req, res) => {
    try {
        const { workoutId, exerciseId } = req.params;
        const { duration } = req.body;

        const workout = await Workout.findById(workoutId);
        if (!workout) {
            req.flash('error', "Séance introuvable.");
            return res.redirect(`/workouts/${workoutId}`);
        }

        const exercise = workout.exercises.id(exerciseId);
        if (!exercise) {
            req.flash('error', "Exercice introuvable.");
            return res.redirect(`/workouts/${workoutId}`);
        }

        // Mise à jour de la durée et recalcul des calories
        exercise.duration = duration;
        exercise.caloriesBurned = (exercise.met * 3.5 * req.user.weight) / 200 * duration;

        await workout.save();
        req.flash('success', "✅ Durée de l'exercice mise à jour !");
        res.redirect(`/workouts/${workoutId}`);
    } catch (error) {
        console.error("❌ Erreur lors de la modification :", error);
        req.flash('error', "Une erreur est survenue.");
        res.redirect(`/workouts/${req.params.workoutId}`);
    }
};

// Supprimer un exercice
exports.deleteExercise = async (req, res) => {
    try {
        const { workoutId, exerciseId } = req.params;

        const workout = await Workout.findById(workoutId);
        if (!workout) {
            req.flash('error', "Séance introuvable.");
            return res.redirect(`/workouts/${workoutId}`);
        }

        // Suppression de l'exercice
        workout.exercises = workout.exercises.filter(ex => ex._id.toString() !== exerciseId);
        await workout.save();

        req.flash('success', "❌ Exercice supprimé avec succès !");
        res.redirect(`/workouts/${workoutId}`);
    } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
        req.flash('error', "Une erreur est survenue.");
        res.redirect(`/workouts/${req.params.workoutId}`);
    }
};
