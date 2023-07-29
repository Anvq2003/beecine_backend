require('dotenv').config();
const mongoose = require('mongoose');
const { MONGO_URI } = process.env;
async function connect() {
  try {
    await mongoose.connect(`${MONGO_URI}`);
    console.log('Connect successfully!');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };
