/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());



// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

var userData = [];

app.post("/signup", (req, res) => {
  var currentUser = req.body;

  var checkIfExists = false;

  for(var i = 0; i < userData.length; i++) {
    if(userData[i].email === currentUser.email) {
      checkIfExists = true;
      break;
    }
  }

  if(checkIfExists === true) {
    res.status(400).send("User Already Exists With this Username !! ")
  }
  else {
    const uniqueId = Date.now();
    currentUser["id"] = uniqueId;
    userData.push(currentUser);
    res.status(201).send("User Added !");
  }

  console.log(currentUser);
})

app.post("/login", (req, res) => {
  var currentUser = req.body;
  console.log(currentUser);

  var validUser = false;
  var user = {};

  for(var i = 0; i < userData.length; i++) {
    if((userData[i].email === currentUser.email) && (userData[i].password === currentUser.password)) {
      // console.log(userData[i].username, userData[i].password);
      validUser = true;
      user = userData[i];
      break;
    }
  }

  // console.log(validUser);

  if(validUser) {
    const data = {id : user.id}
    res.status(200).send(data);
  }
  else {
    res.status(401).send("Authentication Failed");
  }
})

app.get("/data", (req, res) => {
  var currentUser = req.headers;

  var validUser = false;

  for(var i = 0; i < userData.length; i++) {
    if(userData[i].email === currentUser.email && userData[i].password === currentUser.password) {
      validUser = true;
    }
  }

  var data = [];

  for(var i = 0; i < userData.length; i++) {
    data.push({
      "email" : userData[i].email,
      "firstName" : userData[i].firstName,
      "lastName" : userData[i].lastName,
      "id" : userData[i].id
    })
  }

  if(validUser) {
    res.status(200).send({"users" : data});
  }
  else {
    res.status(401).send("Un Authorized User!!");
  }


})

app.get("/", (req, res) => {
  res.send("Authentication Server Initial Route !! ")
})

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })

module.exports = app;
