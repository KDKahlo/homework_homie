var express = require('express');
var router = express.Router();
const db = require("../model/helper");
var bcrypt = require("bcrypt");
const saltRounds = 10;



//endpoint to get all students
// code snippet for testing in Postman: localhost:5000/api/student
router.get("/", async function(req, res, next) {
  try {
    const result = await db("SELECT * FROM students;");
    res.send(result.data);
  } catch (err) {
    res.status(500).send(err)
  }
});
//endpoint to get student by id
router.get("/:id", async function(req, res, next) {
  try {
    const studentId = req.params.id; // Get the student ID from the request URL
    const result = await db(`SELECT * FROM students WHERE id = ?;`, [studentId]); // Use parameterized query to prevent SQL injection
    
    if (result.data.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.data[0]); // Return the student object
  } catch (err) {
    res.status(500).send(err);
  }
});
/* POST a new student */


router.post("/", async function (req, res) {
  try {
      const { firstname, lastname, email, username, avatar, password } = req.body;

      console.log("Received registration data:", req.body);

      // ✅ Validate required fields
      if (!firstname || !lastname || !email || !username || !password) {
          return res.status(400).json({ message: "Please complete all required fields." });
      }

      // ✅ Check if username or email already exists
      const existingUser = await db("SELECT * FROM students WHERE username = ? OR email = ?", [username, email]);

      if (existingUser.data.length > 0) {
          return res.status(400).json({ message: "Username or email already in use." });
      }

      // ✅ Hash the password securely
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // ✅ Use a parameterized query to prevent SQL injection
      const query = `INSERT INTO students (firstname, lastname, email, username, avatar, password) 
                     VALUES (?, ?, ?, ?, ?, ?);`;

      await db(query, [firstname, lastname, email, username, avatar || null, hashedPassword]);

      // ✅ Fetch the newly created user (excluding password for security)
      const newUser = await db("SELECT id, firstname, lastname, email, username, avatar FROM students WHERE username = ?", [username]);

      console.log("New user registered:", newUser.data[0]);

      res.status(201).json({ message: "Registration successful!", student: newUser.data[0] });

  } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
  }
});

//needed to update JOHN DOE PASSWORD SO IT COULD BE HASHED 
//   router.put("/:username/password", async function(req, res, next) {
//     const { password } = req.body;
//     const { username } = req.params;
    
//     if (!password) {
//         res.status(400).send({
//             message: "Please provide a new password",
//         });
//         return;
//     }

//     try {
//         // Hash the new password
//         const hash = await bcrypt.hash(password, 10); // Use 10 salt rounds

//         // Update the password only using interpolated query
//         await db(
//             `UPDATE students 
//             SET password = '${hash}' 
//             WHERE username = '${username}';`
//         );

//         res.send({
//             message: "Password updated successfully"
//         });
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });


  module.exports = router;