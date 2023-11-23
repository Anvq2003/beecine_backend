const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const admin = require('firebase-admin');

const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('./config/index');
const { connect } = require('./config/db.config');
const routes = require('./routes');

const serviceAccount = require('./beecine-key-firebase.json');

const app = express();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'beecine-afb84.appspot.com',
});

initializeApp(firebaseConfig);

// Initialize Firebase

// Connect to DB
connect();

// CORS
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// init routes
routes(app);

module.exports = app;
