const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    console.log("❌ Email introuvable:", email);
                    return done(null, false, { message: "Cet email n'est pas enregistré." });
                }

                // 🔹 Vérifier le mot de passe haché
                // console.log("🔹 Mot de passe entré :", password);
                // console.log("🔹 Mot de passe stocké :", user.password);

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    console.log("❌ Mot de passe incorrect pour:", email);
                    return done(null, false, { message: "Mot de passe incorrect." });
                }

                console.log("✅ Connexion réussie pour:", email);
                return done(null, user);
            } catch (err) {
                console.error("❌ Erreur dans Passport:", err);
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
