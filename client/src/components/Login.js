import React, { useState, useEffect } from "react";
import axios from "axios";

function Login({ navigateToPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    //check if user is already logged in
    axios
      .get("http://localhost:8000/userInfo", { withCredentials: true })
      .then((res) => {
        //user is loggin in
        navigateToPage("guest");
      })
      .catch((error) => {
        console.log("User not logged in");
      });
  }, [navigateToPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8000/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      navigateToPage("guest");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid email or password.");
      } else {
        console.error("Login error", error);
        alert("An error occurred during login.");
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <button type="submit">Login</button>
        <button type="button" onClick={() => navigateToPage("welcome")}>
          Back
        </button>
      </form>
    </div>
  );
}

export default Login;
