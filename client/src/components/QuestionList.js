import React, { useState, useEffect } from "react";
import axios from "axios";

export default function QuestionList({ questions, tags, onTitleClick }) {
  // Constants for pagination
  const QUESTIONS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(0);

  // Create a map of tag IDs to tag names
  const tagMap = tags.reduce((map, tag) => {
    map[tag._id] = tag.name;
    return map;
  }, {});

  // Determine the slice of questions to show
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const displayedQuestions = questions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  // Function to fetch username by ID
  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}`);
      return response.data.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown"; // Fallback username
    }
  };

  const IndividualQuestion = ({ question }) => {
    const [username, setUsername] = useState("loading..");

    useEffect(() => {
      fetchUsername(question.asked_by).then(setUsername);
    }, [question.asked_by]);

    const incrementViewCount = async () => {
      try {
        await axios.put(
          `http://localhost:8000/questions/${question._id}/increment-views`
        );
        if (onTitleClick) {
          onTitleClick(question);
        }
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };

    return (
      <div className="individualQuestion">
        <div className="answerViewDiv">
          <p>{question.views} views</p>
          <p>{question.answers.length} answers</p>
        </div>

        <div className="questionTitle">
          <h3 onClick={incrementViewCount}>{question.title}</h3>
          <p className="questionSummary">{question.summary}</p>
          {question.tags.map((tagId) => (
            <button key={tagId} className="tags">
              {tagMap[tagId]}
            </button>
          ))}
        </div>

        <div className="authorDiv">
          <p>
            <span style={{ color: "red" }}>{username}</span>
            <span> </span>
            <span style={{ color: "gray" }}>
              asked {formatQuestionDate(question.ask_date_time)}
            </span>
          </p>
        </div>
      </div>
    );
  };

  // Page handlers
  const handlePrevClick = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextClick = () => {
    if (startIndex + QUESTIONS_PER_PAGE < questions.length) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setCurrentPage(0);
    }
  };

  if (questions.length === 0) {
    return <h1>No Questions Found</h1>;
  }

  return (
    <div>
      <div id="questionDivs">
        {displayedQuestions.map((question) => (
          <IndividualQuestion key={question._id} question={question} />
        ))}
      </div>
      {questions.length > QUESTIONS_PER_PAGE && (
        <div className="pagination">
          <button onClick={handlePrevClick} disabled={currentPage === 0}>
            Prev
          </button>
          <button onClick={handleNextClick}>Next</button>
        </div>
      )}
    </div>
  );
}

export function formatQuestionDate(askedDateString) {
  const askedDate = new Date(askedDateString);
  const currentDate = new Date();
  const timeDiffInSeconds = Math.floor((currentDate - askedDate) / 1000);

  if (timeDiffInSeconds < 60) {
    if (timeDiffInSeconds === 1) {
      return `${timeDiffInSeconds} second ago`;
    } else {
      return `${timeDiffInSeconds} seconds ago`;
    }
  }

  const timeDiffInMinutes = Math.floor(timeDiffInSeconds / 60);
  if (timeDiffInMinutes < 60) {
    if (timeDiffInMinutes === 1) {
      return `${timeDiffInMinutes} minute ago`;
    } else {
      return `${timeDiffInMinutes} minutes ago`;
    }
  }

  const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
  if (timeDiffInHours < 24) {
    if (timeDiffInHours === 1) {
      return `${timeDiffInHours} hour ago`;
    } else {
      return `${timeDiffInHours} hours ago`;
    }
  }

  const year = askedDate.getFullYear();
  const month = askedDate.toLocaleString("default", { month: "short" });
  const day = askedDate.getDate();
  const hour = askedDate.getHours();
  const minute = askedDate.getMinutes().toString().padStart(2, "0");

  return `asked ${month} ${day}, ${year} at ${hour}:${minute}`;
}
