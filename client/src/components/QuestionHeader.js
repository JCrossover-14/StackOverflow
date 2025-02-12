import React, { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
import axios from "axios";

export const checkLoginStatus = async () => {
  try {
    const response = await axios.get("http://localhost:8000/userInfo", {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default function QuestionHeader({ onAskQuestionClick, onTitleClick }) {
  const [questionArr, setQuestionArr] = useState([]);
  const [tagsArr, setTagsArr] = useState([]);
  const [ansArr, setAnswerArr] = useState([]);
  const [sortingMode, setSortingMode] = useState("newest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/questions");
        sortQuestions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tags");
        setTagsArr(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAns = async () => {
      try {
        const response = await axios.get("http://localhost:8000/answers");
        setAnswerArr(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const updateLoginStatus = async () => {
      const loggedIn = await checkLoginStatus();
      setIsLoggedIn(loggedIn);
    };

    fetchQuestions();
    fetchTags();
    fetchAns();
    updateLoginStatus();
  }, [sortingMode]);

  const sortQuestions = (questions) => {
    let sortedQuestions = [...questions];
    switch (sortingMode) {
      case "newest":
        sortedQuestions.sort(
          (a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)
        );
        break;
      case "active":
        sortedQuestions.sort((a, b) => {
          const mostRecentAnswerA = getMostRecentAnswerDate(a, ansArr);
          const mostRecentAnswerB = getMostRecentAnswerDate(b, ansArr);
          return mostRecentAnswerB - mostRecentAnswerA;
        });
        break;
      case "unanswered":
        sortedQuestions = sortedQuestions.filter((q) => q.answers.length === 0);
        break;
      default:
        sortedQuestions.sort(
          (a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)
        );
    }
    setQuestionArr(sortedQuestions);
  };

  function getMostRecentAnswerDate(question, answerArr) {
    let mostRecentAnswerDate = null;

    for (const answerId of question.answers) {
      const answer = answerArr.find((a) => a._id === answerId);
      if (answer) {
        const ansDate = new Date(answer.ans_date_time);
        if (!mostRecentAnswerDate || ansDate > mostRecentAnswerDate) {
          mostRecentAnswerDate = ansDate;
        }
      }
    }

    return mostRecentAnswerDate;
  }

  const handleAskQuestionClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to ask a question.");
    } else {
      onAskQuestionClick();
    }
  };

  return (
    <div>
      <QuestionMetaHeader
        onAskQuestionClick={handleAskQuestionClick}
        setSortingMode={setSortingMode}
        displayedQuestionCount={questionArr.length}
      />
      {questionArr.length > 0 && tagsArr.length > 0 && (
        <QuestionList
          questions={questionArr}
          tags={tagsArr}
          onTitleClick={onTitleClick}
        />
      )}
    </div>
  );
}

function QuestionMetaHeader({
  onAskQuestionClick,
  displayedQuestionCount,
  setSortingMode,
}) {
  return (
    <div>
      <div id="topQuestionHeader">
        <div id="spacingDiv">
          <h2 id="allQuestions">All Questions</h2>
          <button id="askQuestionButton" onClick={onAskQuestionClick}>
            Ask Question
          </button>
        </div>
        <div id="spacingDiv2">
          <p>{displayedQuestionCount} questions</p>
          <div id="selector">
            <button onClick={() => setSortingMode("newest")}>Newest</button>
            <button onClick={() => setSortingMode("active")}>Active</button>
            <button onClick={() => setSortingMode("unanswered")}>
              Unanswered
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
