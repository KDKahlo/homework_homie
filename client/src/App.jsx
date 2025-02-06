import { useState, useEffect } from 'react';// import React library to use its features
import './App.css';  // import CSS file for styling
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'; // import components from react-router-dom for routing
import Subject from './components/Subject'; // import a component called Subject
import Dashboard from './components/Dashboard'; // import a component called Dashboard
import Login from './components/Login';
import RegisterNewStudent from './components/RegisterNewStudent';
import ClickableDate from './components/ClickableDate'; // Import the ClickableDate component



function App() {
  // get today's date and format it
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString(undefined, options);

   const [userData, setUserData] = useState(() => { //userData is the current state value. setUserData is a function used to update the state
    //arrow function is used as the initial state and it checks the local storage for a key named "userData" 
    //if there is value stored for "userData" in the local storage (storedUserData)
    // it parses the JSON string into a JavaScript object
    const storedUserData = localStorage.getItem("userData"); 
    // returned value from the arrow function will be used as the initial value for userData
    // if not, it returns null
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  useEffect(() => {
    console.log("userData in App.jsx:", userData); // Log userData here
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);
  
  return (
    <Router>{/* Router component is used to wrap all our routes */}
      <div>
            
        <Routes>{/* Routes component holds all our defined routes */}
          <Route path="/" element={<Login setUserData = { setUserData }/>} /> 
          {/*Route for main page, which features a login form and the link to registration page if student is not added to database*/}
          <Route path="/RegisterNewStudent" element={<RegisterNewStudent />} />
          <Route path="/dashboard" element={<Dashboard userData={userData} today={today} />} />
          {/* Route for Dashboard, which is shown when the student is logged in */}
          <Route path="/:subject" element={<Subject />} /> 
          {/* Route for the Subject component, which is shown when the URL has something after /, like /math or /science */}
          {/* :subject captures whatever comes after the route, so you can grab values from the URL */}
          <Route path="/calendar" element={<ClickableDate inline />} /> {/* Route for ClickableDate */}
        </Routes>
    
      </div>


    </Router>
  );
}

export default App;