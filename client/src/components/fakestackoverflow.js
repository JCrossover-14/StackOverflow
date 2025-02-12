import React, { useState } from "react";
import WelcomePage from "./WelcomePage";
import Register from "./Register";
import FakeStackOverflow2 from "./FakeStackOverflow2";
import Login from "./Login";

function FakeStackOverflow() {
  const [currentPage, setCurrentPage] = useState("welcome");

  //redirection
  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  let render;

  switch (currentPage) {
    case "welcome":
      render = <WelcomePage navigateToPage={navigateToPage} />;
      break;
    case "register":
      render = <Register navigateToPage={navigateToPage} />;
      break;
    case "login":
      render = <Login navigateToPage={navigateToPage} />;
      break;
    case "guest":
      render = <FakeStackOverflow2 navigateToPage={navigateToPage} />;
      break;
    default:
      render = <WelcomePage navigateToPage={navigateToPage} />;
  }

  return render;
}

export default FakeStackOverflow;
