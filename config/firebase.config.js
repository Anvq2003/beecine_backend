const admin = require('firebase-admin');

const { initializeApp } = require('firebase/app');
const firebaseConfig = {
  apiKey: 'AIzaSyBNGmeb8JCwaXj70F7Y7iC9DSgshMOZvEA',
  authDomain: 'beecine-afb84.firebaseapp.com',
  projectId: 'beecine-afb84',
  storageBucket: 'beecine-afb84.appspot.com',
  messagingSenderId: '1026925064557',
  appId: '1:1026925064557:web:2ac1e9dfee7592fb66ea64',
};

const app = initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(app),
  storageBucket: 'beecine-afb84.appspot.com',
});

const bucket = admin.storage().bucket();
module.exports = { bucket, admin };
