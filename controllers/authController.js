const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.showLoginPage = (req, res) => {
    res.render('login', { 
        title: 'Connexion', 
        errorMessage: req.flash('errorMessage'),
        successMessage: req.flash('successMessage')
    });
};

// Connexion de l'utilisateur avec Passport
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("❌ Erreur pendant l'authentification :", err);
            return next(err);
        }

        if (!user) {
            console.log("❌ Échec de connexion:", info.message);
            req.flash('errorMessage', info.message);
            return res.redirect('/auth/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error("❌ Erreur lors de la connexion :", err);
                return next(err);
            }
            console.log("✅ Connexion réussie pour:", user.email);
            req.flash('successMessage', `Bienvenue ${user.firstName} !`);
            return res.redirect('/');
        });
    })(req, res, next);
};


// Affichage de la page d'inscription
exports.showRegisterPage = (req, res) => {
	res.render('register', { title: 'Inscription', errorMessage: req.flash('errorMessage') });
};

// Inscription d'un utilisateur
exports.registerUser = async (req, res) => {
    const {
        firstName,
        lastName,
        birthDate,
        weight,
        height,
        dailyWaterIntake,
        goal,
        city,
        gender,
        dietaryPreference,
        activityLevel,
        initialWeight,
        targetWeight,
        email,
        password,
        password2
    } = req.body;

    if (password !== password2) {
        req.flash('errorMessage', 'Les mots de passe ne correspondent pas.');
        return res.redirect('/auth/register');
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            req.flash('errorMessage', 'Cet email est déjà utilisé.');
            return res.redirect('/auth/register');
        }

        // 🔹 NE PAS HASHER ICI ! MongoDB le fera avec `pre('save')`
        const newUser = new User({
            firstName,
            lastName,
            birthDate,
            weight,
            height,
            dailyWaterIntake,
            goal,
            city,
            gender,
            dietaryPreference,
            activityLevel,
            initialWeight,
            targetWeight,
            email: email.toLowerCase().trim(),
            password // Stocker en clair, il sera haché dans `User.js`
        });

        // 🔹 Debugging pour voir si le hachage est bien fait par `UserSchema.pre('save')`
        // console.log("🔹 Avant save, mot de passe:", newUser.password);

        // Sauvegarde dans MongoDB
        await newUser.save();
        console.log("✅ Utilisateur enregistré avec succès !");
        req.flash('successMessage', 'Inscription réussie ! Connectez-vous.');
        res.redirect('/auth/login');

    } catch (err) {
        console.error('❌ Erreur lors de l\'inscription:', err);
        req.flash('errorMessage', 'Une erreur est survenue, veuillez réessayer.');
        res.redirect('/auth/register');
    }
};

// 🟢 Déconnexion de l'utilisateur
exports.logoutUser = (req, res) => {
	req.logout((err) => {
		if (err) return next(err);
		req.flash('successMessage', 'Vous êtes déconnecté.');
		res.redirect('/auth/login');
	});
};
