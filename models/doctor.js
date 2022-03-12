const Sequelize  = require('sequelize') // require 3rd party lib

 const sequelize = require('../util/database') // require initiated the connection

 const Doctor = sequelize.define('doctor-clinic',{
   id:{
   type:Sequelize.INTEGER,
   autoIncrement: true,
   allowNull: false,
   primaryKey: true
   },
   first_name:{
   type: Sequelize.STRING
   },
   last_name:{
   type: Sequelize.STRING
   },
   username:{
   type: Sequelize.STRING
   },
   password:{
   type: Sequelize.STRING
   },
   email:{
   type: Sequelize.STRING
   },
   waiting_time:{
   type: Sequelize.INTEGER
   },
   consultaion_fee:{
   type: Sequelize.INTEGER
   },
   city:{
   type: Sequelize.STRING
   },
   region:{
   type: Sequelize.STRING
   },
   date_of_birth:{
   type: Sequelize.DATE
   },
   specialization:{
   type: Sequelize.STRING
   },
   age:{
   type: Sequelize.INTEGER
   }
 })

 module.exports = Doctor;










