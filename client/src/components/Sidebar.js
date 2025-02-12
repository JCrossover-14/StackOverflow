import React, { useState, useEffect } from "react";
import axios from "axios";

function Sidebar({ setCurrentPage, onLogout }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:8000/userInfo", {
          withCredentials: true,
        });
        setIsLoggedIn(response.status === 200);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div id="sidebar" className="sidebar">
      <button
        id="questionButton"
        onClick={() => setCurrentPage("questionHeader")}
      >
        Questions
      </button>
      <button id="tagButton" onClick={() => setCurrentPage("tags")}>
        Tags
      </button>
      {isLoggedIn ? (
        <button id="tagButton" onClick={() => setCurrentPage("user")}>
          User Profile
        </button>
      ) : null}

      {isLoggedIn ? (
        <button id="tagButton" onClick={onLogout}>
          Logout
        </button>
      ) : (
        <button id="tagButton" onClick={onLogout}>
          Login
        </button>
      )}
    </div>
  );
}

export default Sidebar;
