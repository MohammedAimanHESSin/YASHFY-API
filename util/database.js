const Sequelize = require('sequelize');
//username: root
//password: root
const sequelize = new Sequelize('yashfy-database', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
