# Introduction 
We introduce **Web Server for YASHFY Intelligent Healthcare System**, a health care application that makes both the doctor’s and patient’s life easier.

# YASHFY- REST-API
**REST API** for intelligent healthcare system made in **Node.Js & Express & Sequelize(mysql)**, 
- Implemnting both server side validation and authentication
- Encrypting passwords in our Mysql database
- Using Sequelize ORM

## *EndPoints*
### Doctor
- **sign-up**
- **log-in**
- **add Qulaification(s) to doctor** 
- **getSingleDoctor** and more ....

check for **[Doctor Endpoints Manuel](https://github.com/MohammedAimanHESSin/YASHFY-API/blob/master/Doctors-Endpoints-Manual.txt)** for details  

### Patient
- **sign-up**   
- **log-in**
- **add insurance** 
- **patient-profile** and more ....

check for **[Patient Endpoints Manuel](https://github.com/MohammedAimanHESSin/YASHFY-API/blob/master/Doctors-Endpoints-Manual.txt)** for details  

## *Database Design*

![This is an image](https://github.com/MohammedAimanHESSin/YASHFY-API/blob/master/Database-Files/Relational_model.png)

## How To use?
You can run the API locally on your machine by following below steps:
1. Clone the repo or just download it. 
2. Open the project in any editor (VS code is recommended).
3. Open terminal in the project path ```cd /...../YASHFY-API```.
4. run command: ```npm install``` to inastall all appropriate dependencies.
5. You should now install mysql database workbench to handel DB requests and load on it our data.
6. Last thing to run command: ```npm run start:dev```, and now your server is running and listenning on port [8080]. (you can change the port num from app.js file)
  
## Live Demo 
   **[Yashfy APP](https://test-api-yashfy.herokuapp.com)**

## *Authors*
- **[Moahmmed Aiman](https://github.com/MohammedAimanHESSin)**
- **[Zeyad Nasrat](https://github.com/ZozNasrat)**



---
_This README made with ❤️ by [Moahmmed Aiman](https://github.com/MohammedAimanHESSin)_
