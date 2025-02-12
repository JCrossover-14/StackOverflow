import React, { useState, useEffect } from "react";
import axios from "axios";

const Tags = ({
  onAskQuestionClick,
  onTitleClick,
  onTagSelected,
  setCurrentPage,
}) => {
  const [questionArr, setQuestionArr] = useState([]);
  const [tagsArr, setTagsArr] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to fetch questions
  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/questions");
      setQuestionArr(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch tags
  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tags");
      setTagsArr(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Check login status
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

  useEffect(() => {
    fetchQuestions();
    fetchTags();
    const updateLoginStatus = async () => {
      const loggedIn = await checkLoginStatus();
      setIsLoggedIn(loggedIn);
    };
    updateLoginStatus();
  }, []);

  const handleAskQuestionClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to ask a question.");
    } else {
      onAskQuestionClick();
    }
  };

  const onTagClick = (tagName) => {
    const filteredQuestions = filterQuestionsByTag(tagName);
    onTagSelected(filteredQuestions);
    setCurrentPage("tagsFilteredQuestions");
  };

  function filterQuestionsByTag(selectedTag) {
    const tag = tagsArr.find((tag) => tag.name === selectedTag);
    if (!tag) return [];
    return questionArr.filter((question) => question.tags.includes(tag._id));
  }

  // Calculate the number of questions per tag
  let tagMap = new Map(tagsArr.map((tag) => [tag._id, 0]));
  questionArr.forEach((question) => {
    question.tags.forEach((tagId) => {
      if (tagMap.has(tagId)) {
        tagMap.set(tagId, tagMap.get(tagId) + 1);
      }
    });
  });

  return (
    <div className="main">
      <div id="tagTopDiv">
        <h2 id="tag1">{tagsArr.length} Tags</h2>
        <h2 id="tag2">All Tags</h2>
        <button id="askQuestionButton" onClick={handleAskQuestionClick}>
          Ask Question
        </button>
      </div>

      <div className="grid-container">
        {tagsArr.map((tag) => (
          <div className="tag" key={tag._id}>
            <button className="tagLink" onClick={() => onTagClick(tag.name)}>
              {tag.name}
            </button>
            <p>{tagMap.get(tag._id)} questions</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tags;
