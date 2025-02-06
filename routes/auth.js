var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var studentLoggedIn = require("../guards/studentLoggedIn");
var db = require("../model/helper");
require("dotenv").config();
var bcrypt = require("bcrypt");

const supersecret = process.env.SUPER_SECRET;

  // POST: LOGIN student
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log("THIS IS REQ.BODY", req.body);

    try {
        // Fetch user from database
        const results = await db(
            `SELECT * FROM students WHERE username = '${username}'`
        );

        console.log("THIS IS USERNAME", username);
        const user = results.data[0];
        console.log("THIS IS USER", user);

        if (!user) {
            return res.status(400).send({ message: "Student does not exist" });
        }

        const user_id = user.id;
        const hashedPassword = user.password; // The stored hashed password
        console.log("THIS IS hashedPassword: ", hashedPassword);
        console.log("THIS IS enteredPassword: ", password);

        // Compare entered password with stored hash
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

        console.log("Password match:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(400).send({ message: "Incorrect password" });
        }

        // Generate JWT token
        var token = jwt.sign({ user_id }, supersecret);
        console.log("User data:", user);

        // Send response with token and user data
        res.send({ message: `Hello, ${user.firstname}`, token, student: user });

    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


module.exports = router;
