'use strict';

require('dotenv').config();
const server = require('./src/server.js');
const {sequelize} = require('./src/auth/models/index.model.js');

sequelize.sync()
  .then(() => {
    server.listen(3000, () => console.log('server up'));
  }).catch(e => {
    console.error('Could not start server', e.message);
  });