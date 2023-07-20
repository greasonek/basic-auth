# Terminology

- *Authentication*:
  - Making sure you are who you say you are

- *Authorization*:
  - Making sure user is allowed to be where they're trying to be/ what you can do based on who you are

- **cryptographic hash**:
  - A way to safely store a password with representational text (encrypted/enciphered text)
  - This can be stored in place of a password to verify the user

*Stored in database*:
  userName
  userEncryptedPassword

*Server*:
  /signUp route
  /signIn route

*Client*:
  - makes a request that they want to sign in
  - have a useNname and passWord

server turns password into an encrypted **HASH**
store encrypted hash into the database

/signin verify that they password they sent *compares* and matches the hashed password we have saved in the db

## Encoding vs Encryption

- *encoding*:
  - can be decoded
  - mutated data using a specific sequence ot modify it
  - *base-64* = library we use to encode things

- *encryption*:
  - can't be decoded
  - some additional data is sprinkled in (salt)
  - modified several rounds of times

## TO DO! (some things already written)

### import/require our 3rd party libs and npm i

require ('dotenv).config();
const express = require('express);
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');

### define port dbURL express server app.use

const PORT = process.env.PORT || 3002;
const DATABASE_URL = process.env.DBURL;

const sequelizeDatabase = new Sequelize(DATABASE_URL);

const server = express();

server.use(express.json());

// this allows us to accept webform data
server.use(express.urlencoded({extended: true}));

### create a user model - show hook

const userModel = sequelizeDatabase.define('users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// this is a hook
// sequelize allows us to interact with the usermodel before adding data to the db using the beforeCreate hook

userModel.beforeCreate((user) => {
  console.log('this is the user I am about to create', user);
});

### create basic auth middleware

const basicAuth = async(req, res, next) => {
  let { authorization } = req.headers

// split Basic away from the encoded part
// split splits the string into an array - the string is broken off into separate elements delineated by the value in the argument (in this case it is a space)
let encodedStr = authorization.split(' ')[1];
console.log(encodedStr);

// now we need to decode the encoded string
let decodedStr = based64.decode(encodedStr);
//looks like this --> username:password

const [username, password] = decodedStr.split(':');
// will return an array like --> ['username', 'password']
console.log(username, password);

//find the model where the username matches
let user = await userModel.findOne({where: {username: username}});
console.log('I found the user', user);
if (!user) {
  next('Not authorized, no account exists');
}

  //compare the password to the encrypted password saved in the model
let isValid = await bcrypt.compare(password, user.password);
if (isValid) {
  req.user = user;
  next();
} else {
  next('not authorized, password incorrect');
}

}

### Create sign up route

server.post('/signup', async (req, res) => {
  try {
    const {username, pasword} = req.body;
    const encryptedPW = await bcrypt.hash(password, 5);
    // save to db
    let newUser = await userModel.create({username, password: encryptedPW});
    res.status(200).send(newUser);
  } catch(e) {
    next('sign up error occured');
  }
});

### create sign in route

server.post('signin', basicAuth, (req, res, next) => {
  res.status(200).send(req.user);
});

### - start my server

sequelizeDatabase
.sync()
.then(() => server.listen(PORT))
.catch((e) => console.error(e))

thunderclient:
localhost:3000/signup
POST request
BODY
{
  'username': 'bodhi',
  'password': 'IAMBEAN'
}

POST request to sign IN
AUTH
BASIC
insert username and password just created above

# CLASS NOTES

'use strict';
//two new libraries

const base64 = require('base-64');
const bcrypt = require('bcrypt');

console.log("********")

// encode using base-64 - can be decoded
let str = 'I LOVE DOGGOS';
let encodedString = base64.encode(str);
console.log(encodedString);
let decodedString = base64.decode(encodedString);
console.log(decodedString);

// we use base64 encoded string in the Basic Auth for the req header
// basic auth string: Basic <some encoded value>
// the encoded value username:password
// example
// headers:{
  // Authorization: Basic asfjafisdl123
// }

// example of Basic Auth header
let userAndPass = 'Bodhi:Bean';
const justThePassword = 'Bean';
let encodedUserAndPass = base64.encode(userAndPass);
console.log({encodedUserAndPass});
// receive something that looks like "Basic asfjafisdl123" - get the part that is encoded, decode and split it by (':')[1] then encrypt the password

// auth string
let authStr = `Basic ${encodedUserAndPass}`;

// to securely store data in the db we need it to be more safe
// can't be decoded
// it comes in encoded, we will decode it and store it safely or check agains what we have stored

const encrypt = async (password) => {
  let hash = await bcrypt.hash(password, 5);
  console.log({name: justTheUser, password: hash});
  return hash;
}
console.log('***** bcrypt *****');
const encryptedPW = encrypt(justThePassword);
const justTheUser = 'Bodhi';

//in our user model we'd have something like
console.log({name: justTheUser, password: encryptedPW});

LAB Q's!

<!-- - index.model.js - exporting correctly? -->
<!-- - index.js - importing sequelize correctly/appropriatly? -->
<!-- - middleware... -->
<!-- - exporting basic correctly? -->
<!-- - should I import server into basic middleware? -->
- adding before-create hook in the model?