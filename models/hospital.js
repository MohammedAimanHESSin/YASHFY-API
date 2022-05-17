const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Hospital = sequelize.define('hospital', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    hospital_name: Sequelize.STRING
  }, { timestamps: false });
  
  module.exports = Hospital;
  