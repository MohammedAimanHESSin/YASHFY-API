const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Patient = sequelize.define('patient', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    username: Sequelize.STRING,
    email: {type: Sequelize.STRING, unique: true },
    password: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    phone_number: Sequelize.STRING,
    date_of_birth: Sequelize.DATEONLY,
    street_address: Sequelize.STRING,
    city: Sequelize.STRING,
    country: Sequelize.STRING,
}, { timestamps: false } );

module.exports = Patient;