const Sequelize = require('sequelize')

const sequelize = require('../util/database');


const Review = sequelize.define('review', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    is_review_annoymous: {
      type:Sequelize.BOOLEAN
    },
    review: Sequelize.STRING  //varchar(255) -> validate it according in front! 
} 
);

module.exports = Review;