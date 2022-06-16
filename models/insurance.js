const Sequelize = require('sequelize')

const sequelize = require('../util/database');


const Insurance = sequelize.define('insurance', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    insurance_name : Sequelize.STRING 
} , { timestamps: false }
);

module.exports = Insurance;