'use strict';

require('dotenv').config();
const express = require('express');
const basic = require('../src/auth/middleware/basic.js');
const { sequelize, Users } = require('../src/auth/models/index.model.js');
const server = express();
const bcrypt = require('bcrypt');

// const basic = require('./auth/middleware/basic.js');


server.use(express.json());

server.use(express.urlencoded({ extended: true }));

server.post('/signup', async (req, res) => {

  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const record = await Users.create(req.body);
    res.status(200).json(record);
  } catch (e) { res.status(403).send('Error Creating User'); }
});

const handleSignIn = async (req, res) => {
  res.status(200).send(req.user);
}; 

server.post('/signin', basic, handleSignIn); 

module.exports = server;