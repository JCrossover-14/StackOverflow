import React, { useState } from "react";
import axios from "axios";

function Register({ navigateToPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register", {
        username,
        email,
        password, // Send the raw password, hashing is handled on the server
      });

      // Handle response here. E.g., navigate to the login page or display a success message.
      console.log(response.data); // For debugging purposes
      navigateToPage("login"); // Example: navigate to the login page upon successful registration
    } catch (error) {
      // Handle errors here. E.g., display a message if the email is already in use.
      if (error.response && error.response.status === 400) {
        alert(error.response.data);
      } else {
        console.error("Registration error", error);
        alert("An error occurred during registration.");
      }
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
        <button type="button" onClick={() => navigateToPage("welcome")}>
          Back
        </button>
      </form>
    </div>
  );
}

export default Register;
