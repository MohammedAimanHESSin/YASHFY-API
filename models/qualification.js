const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Qualification = sequelize.define('qualification', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    qualification_name: Sequelize.STRING,
    institute_name: Sequelize.STRING,
    procurement_year: Sequelize.DATE
  });
  
  module.exports = Qualification;
  