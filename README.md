# Introduction 
We introduce **YASHFY Intelligent Healthcare System**, a health care application that makes both the doctor’s and patient’s life easier.

# YASHFY-API
**REST API** for intelligent healthcare system made in **Node.Js & Express & Sequelize(mysql)**, 
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

## How To use?
You can run the API locally on your machine by following below steps:
1. Clone the repo or just download it. 
2. Open the project in any editor (VS code is recommended).
3. Open terminal in the project path ```cd /...../YASHFY-API```.
4. run command: ```npm install``` to inastall all appropriate dependencies.
5. You should now install mysql database workbench to handel DB requests and load on it our data.
6. Last thing to run command: ```npm npm run start:dev```, and now your server is running and listenning on port [8080]. (you can change the port num from app.js file)
  

## *Authors*
- **[Moahmmed Aiman](https://github.com/MohammedAimanHESSin)**
- **[Zeyad Nasrat](https://github.com/ZozNasrat)**

---
_This README made with ❤️ by [Moahmmed Aiman](https://github.com/MohammedAimanHESSin)_
