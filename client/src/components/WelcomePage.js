import React from "react";

function WelcomePage({ navigateToPage }) {
  return (
    <div className="welcome-container">
      <h1>Welcome to FakeStackOverflow</h1>
      <button onClick={() => navigateToPage("register")}>
        Register as New User
      </button>
      <button onClick={() => navigateToPage("login")}>
        Login as Existing User
      </button>
      <button onClick={() => navigateToPage("guest")}>Continue as Guest</button>
    </div>
  );
}

export default WelcomePage;
