import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import QuestionHeader from "./QuestionHeader";
import Tags from "./Tags";
import QuestionForm from "./QuestionForm";
import AnswerPage from "./AnswerPage";
import AnswerForm from "./AnswerForm";
import QuestionList from "./QuestionList";
import SearchedQuestionHeader from "./SearchQuestionHeader";
import UserProfile from "./UserProfile";

export default function FakeStackOverflow2({ navigateToPage }) {
  //handle logout go to welcome page
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/logout",
        {},
        { withCredentials: true }
      );
      navigateToPage("welcome");
    } catch (error) {
      console.error("Logout error", error);
      alert("An error occurred during logout.");
    }
  };

  //tags array
  const [tagsArr, setTagsArr] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/tags")
      .then((response) => {
        setTagsArr(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //changes render the current content
  const [currentPage, setCurrentPage] = useState("questionHeader");

  //set the current question to use for answerspage
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [inputVal, setInputVal] = useState("");
  //filtered tag questions
  const [tagFilteredQuestions, setTagFilteredQuestions] = useState(null);

  let render;

  //set the page render here

  if (currentPage === "questionHeader") {
    render = (
      <QuestionHeader
        onAskQuestionClick={() => setCurrentPage("questionForm")}
        onTitleClick={(question) => {
          setSelectedQuestion(question);
          setCurrentPage("answerPage");
        }}
      />
    );
  } else if (currentPage === "tags") {
    render = (
      <Tags
        onAskQuestionClick={() => setCurrentPage("questionForm")}
        onTitleClick={(question) => {
          setSelectedQuestion(question);
          setCurrentPage("answerPage");
        }}
        onTagSelected={setTagFilteredQuestions}
        setCurrentPage={setCurrentPage}
      />
    );
  } else if (currentPage === "questionForm") {
    render = (
      <QuestionForm
        onAskQuestionClick={() => setCurrentPage("questionHeader")}
      />
    );
  } else if (currentPage === "searchResults") {
    render = (
      <SearchedQuestionHeader
        onAskQuestionClick={() => setCurrentPage("questionForm")}
        onTitleClick={(question) => {
          setSelectedQuestion(question);
          setCurrentPage("answerPage");
        }}
        inputVal={inputVal}
      />
    );
  } else if (currentPage === "answerPage" && selectedQuestion) {
    console.log("loaded answer Page");
    render = (
      <AnswerPage
        question={selectedQuestion}
        onAskQuestionClick={() => setCurrentPage("questionForm")}
        onAnswerQuestionClick={() => setCurrentPage("answerForm")}
      />
    );
  } else if (currentPage === "answerForm") {
    render = (
      <AnswerForm
        question={selectedQuestion}
        onAnswerSubmitted={(updatedQuestion) => {
          setSelectedQuestion(updatedQuestion);
          setCurrentPage("answerPage");
        }}
      />
    );
  } else if (currentPage === "tagsFilteredQuestions") {
    console.log("loaded tagsFilteredQuestions");
    render = (
      <QuestionList
        questions={tagFilteredQuestions}
        tags={tagsArr}
        onTitleClick={(question) => {
          setSelectedQuestion(question);
          setCurrentPage("answerPage");
        }}
      />
    );
  } else if (currentPage === "user") {
    render = <UserProfile />;
  }

  return (
    <div id="maindiv">
      <Header setCurrentPage={setCurrentPage} setInputVal={setInputVal} />
      <div id="belowheader" className="belowheader">
        {/*lifting state up by passing function and variable*/}
        <Sidebar setCurrentPage={setCurrentPage} onLogout={handleLogout} />
        <div id="main" className="main">
          {render}
        </div>
      </div>
    </div>
  );
}
