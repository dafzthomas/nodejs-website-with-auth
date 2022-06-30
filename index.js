const path = require('path');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const compression = require('compression');

const expressHandlebars = require('express-handlebars');

const dotenv = require('dotenv');

dotenv.config();

const hbs = expressHandlebars.create({
    extname: '.hbs',
    helpers: {
        isEmpty: function (value) {
            if (value.length < 1) {
                return true;
            }

            return false;
        },
    },
});

const Auth = require('./lib/authentication');
const config = require('./config');

const User = require('./models/user');

const app = express();
const port = process.env.PORT || config.serverPort;

mongoose.connect(config.dbConnectionUrl, {
    useNewUrlParser: true,
    dbName: config.dbCollection,
    useUnifiedTopology: true,
});

app.use(compression());
app.set('views', './frontend/views');
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, './frontend')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: config.dbConnectionUrl,
            dbName: config.dbCollection,
            crypto: {
                secret: config.hashingSecret,
            },
        }),
        secret: config.hashingSecret,
    }),
);
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(port, () => console.log(`Web app listening on port ${port}`));

app.use(function (req, res, next) {
    req.session.state = req.session.state || {};

    if (req.user) {
        req.session.state.user = {
            email: req.user.email,
            payhere: req.user.payhere,
        };
    } else {
        delete req.session.state.user;
    }

    res.view = function (viewName, additionalData) {
        res.render(viewName, {
            ...req.session.state,
            ...additionalData,
        });

        req.session.state = {};
    };

    res.viewRedirect = function (url, data) {
        req.session.state = { ...data };

        res.redirect(url);
    };

    next();
});

app.get('/ping', (req, res, next) => {
    res.status(200).jsonp({
        response: 'pong',
    });
});

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/webhooks', require('./routes/webhooks'));

app.get('/', async (req, res) => {
    res.view('homepage', {
        layout: 'homepage',
    });
});

app.get('/tos', async (req, res) => {
    res.view('documents/tos', {
        site_title: 'Terms of Service',
        layout: 'homepage',
    });
});

app.get('/privacy', async (req, res) => {
    res.view('documents/privacy', {
        site_title: 'Privacy Policy',
        layout: 'homepage',
    });
});

app.get('/dashboard', Auth.isAuthenticated, async (req, res) => {
    res.view('dashboard', {
        site_title: 'Dashboard',
    });
});

app.use(function (req, res, next) {
    res.view('404', {
        site_title: '404',
        page_body: "Oops, couldn't find that page.",
    });
});
