import React, { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
import axios from "axios";

export default function SearchedQuestionHeader({
  onAskQuestionClick,
  onTitleClick,
  inputVal,
}) {
  const [questionArr, setQuestionArr] = useState([]);
  const [tagsArr, setTagsArr] = useState([]);
  const [sortingMode, setSortingMode] = useState("newest");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let searchResults = [];
        let tagsMap = new Map();
        const query = extractTagsAndWords(inputVal);
        let queryTags = query.sTags;
        console.log("Query tags is " + queryTags);
        let queryWords = query.sWords;
        console.log("Query words is " + queryWords);
        let tagsSet = new Set();
        for (let i = 0; i < queryTags.length; i++) {
          if (queryTags[i] !== "") {
            tagsSet.add(queryTags[i].toLowerCase());
          }
        }
        console.log("tags set is ");
        console.log(tagsSet);
        const response = await axios.get("http://localhost:8000/questions");
        let questions = response.data;
        console.log(questions);
        const response1 = await axios.get("http://localhost:8000/tags");
        let tags = response1.data;
        console.log("tags is ");
        console.log(tags);
        setTagsArr(tags);
        for (let tag of tags) {
          tagsMap.set(tag._id, tag.name);
        }
        console.log("tags map is ");
        console.log(tagsMap);

        for (let question of questions) {
          console.log("on question " + question.title);
          let found = false;
          for (const word of queryWords) {
            if (word !== "" && question.title.toLowerCase().includes(word)) {
              console.log("found " + word + " in question: " + question.title);
              searchResults.push(question);
              found = true;
              break;
            }
            if (found) continue;
            for (const tag of question.tags) {
              console.log("considering tag " + tag);
              if (tagsSet.has(tagsMap.get(tag))) {
                searchResults.push(question);
                console.log("found " + tagsMap.get(tag));
                break;
              }
            }
          }
        }
        setQuestionArr(searchResults);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuestions();
  }, [inputVal, sortingMode]);

  const sortQuestions = (questions) => {
    let sortedQuestions = [...questions];
    switch (sortingMode) {
      case "newest":
        sortedQuestions.sort(
          (a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)
        );
        break;
      case "active":
        break;
      case "unanswered":
        sortedQuestions = sortedQuestions.filter((q) => q.answers.length === 0);
        break;
      default:
        sortedQuestions.sort(
          (a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)
        );
    }
    return sortedQuestions;
  };

  return (
    <div>
      <QuestionMetaHeader
        onAskQuestionClick={onAskQuestionClick}
        setSortingMode={setSortingMode}
        displayedQuestionCount={questionArr.length}
      />
      {questionArr.length > 0 && tagsArr.length > 0 && (
        <QuestionList
          questions={sortQuestions(questionArr)}
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

function extractTagsAndWords(inputString) {
  let searchTags = [];
  inputString = inputString.toLowerCase();
  while (inputString.indexOf("[") !== -1) {
    let startInd = inputString.indexOf("[");
    let endInd = inputString.indexOf("]", startInd);
    if (endInd === -1) {
      break;
    } else {
      var extract = inputString
        .slice(startInd + 1, endInd)
        .toLowerCase()
        .trim();
      searchTags.push(extract);
      inputString =
        inputString.slice(0, startInd) + inputString.slice(endInd + 1);
    }
  }

  return {
    sTags: searchTags,
    sWords: inputString.toLowerCase().trim().split(" "),
  };
}
