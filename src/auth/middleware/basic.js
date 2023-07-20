'use strict';

const bcrypt = require('bcrypt');
const base64 = require('base-64');
const userModel = require('../models/index.model.js');
const server = require('../../server.js');


// server.post('/signup', async (req, res) => {

//   try {
//     req.body.password = await bcrypt.hash(req.body.password, 10);
//     const record = await Users.create(req.body);
//     res.status(200).json(record);
//   } catch (e) { res.status(403).send('Error Creating User'); }
// });

// server.post('/signin', handleSignIn) 
//res.status(200).send(req.user);

const basic = async (req, res, next) => {
  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'am9objpmb28=']
  let encodedString = basicHeaderParts.pop();  // am9objpmb28=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password
  
  try {
    const user = await userModel.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      req.user = user;
      next();
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) { 
    //send error message as next('error message)
    //write error handling middleware
    res.status(403).send('Invalid Login'); }

};

module.exports = basic;