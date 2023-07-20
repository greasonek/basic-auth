'use strict';

const { beforeAll, afterAll, expect } = require('@jest/globals');

// Need tests for auth middleware and the routes
// Does the middleware function (send it a basic header)
// Do the routes assert the requirements (signup/signin)

const server = require('../src/server');
const supertest = require('supertest');
const { sequelize } = require('../src/auth/models/index.model');
const mockServer = supertest(server);

// test for POST to /signup

const userOne = {username: 'Emma', password: 'ilovedogs'};
const userTwo = {username: 'Josh', password: 'iliketurtles'};

beforeAll(async (done)=> {
  await sequelize.sync();
  done();
});
afterAll(async (done) => {
  await sequelize.drop();
  done();
});

describe('test the server routes and db', () => {
  test('we can post a new user to sign up', async () => {
  // when we send a req to /signup {password username} 
  //via req.body route and get back status: 200 and object: user object made from the model based on data we sent
    // req.body = userOne;
    const res = (await mockServer.post('/signup')).setEncoding(userOne);
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text).username).toBe('Emma');
    expect(JSON.parse(res.text).password).toBeTruthy('ilovedogs');

  });
  // POST to /signin (use basic auth)
  // when we send a req to /signin we will include the encoded 
  //username:password onthe Basic Auth object... we will get back status 200 
  //and user object{password username} based on model from data we sent
  test('we can send a user via Basic Auth to sign in', async () => {
    // const basicAuthStr = `${userTwo.username}: ${userTwo.password}`;
    // const encodedBasicAuthStr = `Basic ${base64.encode(basicAuthStr)}`;
    const res = await mockServer
      .post('/signin')
      .auth(userOne.username, userOne.password);

    expect(res.status).toBe(200);
    expect(JSON.parse(res.text).username).toBe('Emma');
    expect(JSON.parse(res.text).password).toBeTruthy('ilovedogs');  });
});

