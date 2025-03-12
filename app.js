// Importation des modules
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const passport = require('passport');
const methodOverride = require('method-override');
const path = require('path');
const morgan = require('morgan');

// Configuration des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

// Connexion à MongoDB Atlas
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('✅ MongoDB connecté'))
	.catch((err) => console.error('❌ Erreur de connexion MongoDB:', err));

// Configuration de Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la session et des messages flash
app.use(
	session({
		secret: process.env.SECRET_KEY || 'secretKey',
		resave: true,
		saveUninitialized: true,
	})
);
app.use(flash());

// Middleware pour les messages flash
global.successMessage = '';
global.errorMessage = '';
app.use((req, res, next) => {
	res.locals.successMessage = req.flash('success');
	res.locals.errorMessage = req.flash('error');
	next();
});

// Configuration de Passport pour l'authentification
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour rendre l'utilisateur disponible dans toutes les vues
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash('errorMessage');
    res.locals.user = req.user || null;
    next();
});

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const weightRoutes = require('./routes/weightRoutes');
const planningRoutes = require('./routes/planningRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Utilisation des routes
app.use('/auth', authRoutes);
app.use('/workouts', workoutRoutes);
app.use('/performance', performanceRoutes);
app.use('/weight', weightRoutes);
app.use('/planning', planningRoutes);
app.use('/', dashboardRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
);
