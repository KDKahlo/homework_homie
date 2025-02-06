import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function Login({setUserData}) {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState(null); // New state for handling errors

    const navigate = useNavigate();

    const { username, password } = credentials;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const login = async () => {
        if (!username || !password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await axios.post("/api/auth/login", credentials);
            const { data } = response;

            if (response.status === 200) {
                localStorage.setItem("token", data.token);
                setUserData(data.student);
                console.log("UserData in Login component:", data.student); // log userData here
                navigate("/dashboard");
            } else {
                // handle other status codes here
                setError(data.message); // set error message
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login"); // set error message
        }
    };

    return (
        <>
            <h3>Login</h3>
            <div className="login">
                <div className="login-form">
                    <form>
                        <input
                            value={username}
                            onChange={handleChange}
                            name="username"
                            type="text"
                            className="form-control mb-2"
                            placeholder='username'
                            autoComplete='off'
                        />
                        <input
                            value={password}
                            onChange={handleChange}
                            name="password"
                            type="password"
                            className="form-control mb-2"
                            placeholder='password'
                            autoComplete='off'
                        />
                        <button type="button" className="login-button" onClick={login}>Submit</button>
                        <p className="register-option">
                            Not registered? 
                            <br />
                            <Link to="./RegisterNewStudent" className="link-to-add-new-acct">Create an account</Link> 
                        </p>
                    </form>
                </div>
            </div>

            {error && ( // Display error message
                <div className="text-center p-4">
                    <div className="alert">{error}</div>
                </div>
            )}
        </>
    );
}
Login.propTypes = {
    setUserData: PropTypes.func.isRequired, // This defines the prop type and makes it required
};