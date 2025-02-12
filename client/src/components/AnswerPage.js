import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatQuestionDate } from "./QuestionList";

const checkLoginStatus = async () => {
  try {
    const response = await axios.get("http://localhost:8000/userInfo", {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default function AnswerPage({
  question,
  onAskQuestionClick,
  onAnswerQuestionClick,
}) {
  const ANSWERS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [answerArr, setAnswerArr] = useState([]);
  const [answerUsernames, setAnswerUsernames] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [questionAsker, setQuestionAsker] = useState("Unknown");
  const [tagsArr, setTagsArr] = useState([]);

  const handleUpvoteQuestion = async () => {};

  const handleDownvoteQuestion = async () => {};

  const handleUpvoteAnswer = async (answerId) => {};

  const handleDownvoteAnswer = async (answerId) => {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching answers from the server
        const answerResponse = await axios.get("http://localhost:8000/answers");
        const sortedAnswers = answerResponse.data
          .filter((answer) => question.answers.includes(answer._id))
          .sort(
            (a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time)
          );
        setAnswerArr(sortedAnswers);

        // Fetching usernames for each answer
        const userIds = sortedAnswers.map((answer) => answer.ans_by);
        const uniqueUserIds = [...new Set(userIds)];
        uniqueUserIds.forEach(async (userId) => {
          try {
            const userResponse = await axios.get(
              `http://localhost:8000/user/${userId}`
            );
            setAnswerUsernames((prev) => ({
              ...prev,
              [userId]: userResponse.data.username,
            }));
          } catch (error) {
            console.error("Error fetching username for answer:", error);
            setAnswerUsernames((prev) => ({ ...prev, [userId]: "Unknown" }));
          }
        });

        // Fetching username for the question asker
        try {
          const userResponse = await axios.get(
            `http://localhost:8000/user/${question.asked_by}`
          );
          setQuestionAsker(userResponse.data.username);
        } catch (error) {
          console.error("Error fetching username for question asker:", error);
          setQuestionAsker("Unknown");
        }

        // Fetching tags
        try {
          const tagResponse = await axios.get("http://localhost:8000/tags");
          setTagsArr(tagResponse.data);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
      }
    };

    fetchData();
    checkLoginStatus().then(setIsLoggedIn);
  }, [question._id, question.tags, question.answers]);

  // Creating a map of tag IDs to tag names
  const tagMap = tagsArr.reduce((map, tag) => {
    map[tag._id] = tag.name;
    return map;
    console.log(map);
  }, {});

  const handlePrevClick = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextClick = () => {
    if ((currentPage + 1) * ANSWERS_PER_PAGE < answerArr.length) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setCurrentPage(0);
    }
  };

  const startIndex = currentPage * ANSWERS_PER_PAGE;
  const displayedAnswers = answerArr.slice(
    startIndex,
    startIndex + ANSWERS_PER_PAGE
  );

  const handleAnswerQuestionClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to answer the question.");
    } else {
      onAnswerQuestionClick();
    }
  };

  const handleAskQuestionClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to ask a question.");
    } else {
      onAskQuestionClick();
    }
  };

  return (
    <div>
      <div id="answerHeaderDiv">
        <div className="answerHeaderUpperDiv">
          <p id="answerCount">{question.answers.length} answers</p>
          <h2 id="answerTitle">{question.title}</h2>
          <button id="askQuestionButton" onClick={handleAskQuestionClick}>
            Ask Question
          </button>
        </div>
        <div className="answerHeaderLowerDiv">
          <p id="views">{question.views} views</p>
          <div id="questionDetails">
            <p id="questionContent">{convertTextToHyperlinks(question.text)}</p>
            <div id="questionTags">
              {question.tags.map((tagId) => (
                <button key={tagId} className="tags">
                  {tagMap[tagId]}
                </button>
              ))}
            </div>
            <div className="questionVotes">
              <button onClick={handleUpvoteQuestion}>
                <span className="arrow">&uarr;</span> Upvote
              </button>
              <span>{question.votes}</span>
              <button onClick={handleDownvoteQuestion}>
                <span className="arrow">&darr;</span> Downvote
              </button>
            </div>
          </div>
          <div id="authorDiv">
            <p className="author-text">{questionAsker}</p>
            <p className="date-text">
              asked {formatQuestionDate(question.ask_date_time)}
            </p>
          </div>
        </div>
      </div>

      <div id="answerListDiv">
        {displayedAnswers.map((answer) => (
          <div key={answer._id} className="individualAnswerDiv">
            <p className="answerText">{convertTextToHyperlinks(answer.text)}</p>
            <div className="answerVotes">
              <button onClick={() => handleUpvoteAnswer(answer._id)}>
                <span className="arrow">&uarr;</span> Upvote
              </button>
              <span className="voteCount">{answer.votes}</span>
              <button onClick={() => handleDownvoteAnswer(answer._id)}>
                <span className="arrow">&darr;</span> Downvote
              </button>
            </div>
            <p className="answeredby">
              <span style={{ color: "green" }}>
                {answerUsernames[answer.ans_by] || "Loading..."}
              </span>
              <span style={{ color: "gray" }}>
                answered {formatQuestionDate(answer.ans_date_time)}
              </span>
            </p>
          </div>
        ))}
      </div>

      {answerArr.length > ANSWERS_PER_PAGE && (
        <div className="pagination">
          <button onClick={handlePrevClick} disabled={currentPage === 0}>
            Prev
          </button>
          <button onClick={handleNextClick}>Next</button>
        </div>
      )}

      <button id="answerButton" onClick={handleAnswerQuestionClick}>
        Answer Question
      </button>
    </div>
  );
}

function convertTextToHyperlinks(text) {
  const elements = [];
  let previousMatchEnd = 0;

  text.replace(
    /\[(.*?)\]\((.*?)\)/g,
    (match, linkLabel, linkUrl, matchStart) => {
      //ad plain text before the hyperlink
      if (previousMatchEnd !== matchStart) {
        elements.push(
          <span key={`${matchStart}-text`}>
            {text.substring(previousMatchEnd, matchStart)}
          </span>
        );
      }

      //add the hyperlink
      elements.push(
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          key={`${matchStart}-link`}
        >
          {linkLabel}
        </a>
      );

      previousMatchEnd = matchStart + match.length;
      //placeholder
      return match;
    }
  );

  //add remaining text
  if (previousMatchEnd < text.length) {
    elements.push(
      <span key="remainder">{text.substring(previousMatchEnd)}</span>
    );
  }

  //return element with replaced stirng
  return <>{elements}</>;
}
