const Sequelize  = require('sequelize') // require 3rd party lib

 const sequelize = require('../util/database') // require initiated the connection

 const Doctor = sequelize.define('doctor',{
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
   type: Sequelize.STRING, unique: true
   },
   waiting_time:{
   type: Sequelize.STRING,
   defaultValue: 0
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
   type: Sequelize.DATEONLY
   },
   specialization:{
   type: Sequelize.STRING
   },catgs_Clinic: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },catgs_doctor_treatment
  : {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },catgs_staff: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },catgs_waiting_time  : {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },catgs_equipment: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },catgs_price: {
    type: Sequelize.TINYINT
    ,    defaultValue: 0
  },catgs_Other: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },general_rank: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  }
 }, { timestamps: false })

 module.exports = Doctor;










