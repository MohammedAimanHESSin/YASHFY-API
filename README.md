# Introduction 
We introduce **YASHFY Intelligent Healthcare System**, a health care application that makes both the doctor’s and patient’s life easier.

# YASHFY-API
API for intelligent healthcare system made in **Node.Js & Express & Sequelize(mysql)**, 
- Implemnting both server side validation and authentication
- Encrypting passwords in our Mysql database

## *EndPoints*
### Doctor
- **sign-up doctor**: 
  URL: PUT [/auth/doctor-signup?addQualification=(true)]
  
- **log-in docto**r:
  URL: POST [/auth/doctor-login]
  
- **add Qulaification(s) to doctor** [Auth is needed]
  URL:  POST [/doctors/add-qualification]
  
- **getSingleDoctor** [DO NOT Need Auth] | we can make at start a guest auth vaild forever stacked with Front
  URL:  GET[/doctors/:doctorId]
  
### Patient
-
-
-
-
  
## *Database Design*

![This is an image](https://github.com/MohammedAimanHESSin/YASHFY-API/blob/master/Database-Files/Relational_model.png)
