'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user-model');
const sequelize = new Sequelize(process.env.DBURL);
const userModel = User(sequelize, DataTypes);

// const userMod =  


module.exports = { sequelize, userModel };