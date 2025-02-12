import React, { useState, useEffect } from "react";
import axios from "axios";

export default function QuestionForm({ onAskQuestionClick }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  // const [username, setUsername] = useState(""); // Commented out

  const [titleError, setTitleError] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [textError, setTextError] = useState("");
  const [tagsError, setTagsError] = useState("");
  // const [usernameError, setUsernameError] = useState(""); // Commented out

  const [userId, setUserId] = useState(null); // New state for user ID

  useEffect(() => {
    // Fetch user info from session
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8000/userInfo", {
          withCredentials: true,
        });
        setUserId(response.data.id); // Set the user ID
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset error messages
    setTitleError("");
    setSummaryError(""); // Reset summary error
    setTextError("");
    setTagsError("");
    //setUsernameError("");

    let flag = 0;

    // Validation for title
    if (!title.trim()) {
      setTitleError("Title cannot be empty");
      flag = 1;
    } else if (title.length > 50) {
      setTitleError("Title cannot exceed 50 characters");
      flag = 1;
    }

    // Validation for summary
    if (!summary.trim()) {
      setSummaryError("Summary cannot be empty");
      flag = 1;
    } else if (summary.length > 140) {
      setSummaryError("Summary cannot exceed 140 characters");
      flag = 1;
    }

    if (!text.trim()) {
      setTextError("Question text cannot be empty");
      flag = 1;
    }

    /*
    if (!username.trim()) {
      setUsernameError("Username cannot be empty");
      flag = 1;
    }
    */

    let questionTags = tags
      .toLowerCase()
      .split(" ")
      .filter((tag) => tag !== "");
    const tagSet = new Set(questionTags);

    if (tagSet.size > 5) {
      setTagsError("No more than 5 tags, Duplicate tags count as one");
      flag = 1;
    }

    if (tagSet.size === 0) {
      setTagsError("Tags cannot be empty");
      flag = 1;
    }

    for (const tag of tagSet) {
      if (tag.length > 10) {
        setTagsError("Each Tag cannot exceed 10 characters");
        flag = 1;
        break;
      }
    }

    if (!flag) {
      try {
        // Fetch existing tags from the database
        const existingTagsResponse = await axios.get(
          "http://localhost:8000/tags"
        );
        const existingTags = existingTagsResponse.data;

        const tagList = tags
          .split(" ")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0);
        const tagIds = [];

        // Loop through the tag list
        for (let tag of tagList) {
          // Check if the tag already exists
          const existingTag = existingTags.find((t) => t.name === tag);
          if (existingTag) {
            // Use existing tag ID
            tagIds.push(existingTag._id);
          } else {
            // Create a new tag
            try {
              const newTag = await axios.post("http://localhost:8000/tags", {
                name: tag,
              });
              tagIds.push(newTag.data._id);
            } catch (error) {
              console.error(`Error creating tag '${tag}':`, error);
            }
          }
        }

        // Construct the question object
        const questionObj = {
          title: title,
          summary: summary,
          text: text,
          tags: tagIds,
          asked_by: userId, // Use userId from session
        };

        // Post the question
        const response = await axios.post(
          "http://localhost:8000/questions",
          questionObj,
          { withCredentials: true }
        );
        console.log("Question posted:", response.data);
        onAskQuestionClick();
      } catch (error) {
        console.error("Error posting question:", error);
      }
    }
  };

  return (
    <div className="main">
      <form onSubmit={handleSubmit}>
        <h2>Question Title*</h2>
        <p className="italics">Limit title to 50 characters or less</p>
        <input
          type="text"
          className="input1"
          id="titleInput" // Added id for title input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50} // Max length for title
        />
        <div className="errorMessage" style={{ color: "red" }}>
          {titleError}
        </div>

        <h2>Question Summary*</h2>
        <p className="italics">Limit summary to 140 characters or less</p>
        <textarea
          id="summaryInput"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          maxLength={140}
        />
        <div className="errorMessage" style={{ color: "red" }}>
          {summaryError}
        </div>

        <h2>Question Text*</h2>
        <textarea
          id="textInput"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="errorMessage" style={{ color: "red" }}>
          {textError}
        </div>

        <h2>Tags*</h2>
        <input
          type="text"
          className="input1"
          id="tagsInput" // Added id for tags input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="errorMessage" style={{ color: "red" }}>
          {tagsError}
        </div>

        {/* <h2>Username*</h2>
        <input
          type="text"
          className="input1"
          id="usernameInput" // Added id for username input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="errorMessage" style={{ color: "red" }}>
          {usernameError}
        </div> */}

        <button id="postQuestionButton" type="submit">
          Post Question
        </button>
        <span style={{ color: "red" }}>* indicates mandatory fields</span>
      </form>
    </div>
  );
}

export function validLink(text) {
  //create pattern
  const hyperlinkPattern = /\[.*?\]\((.*?)\)/g;
  //array of matches =
  const matches = text.match(hyperlinkPattern);

  if (!matches) return false;

  for (let match of matches) {
    //get the captured group
    const link = match.match(/\((.*?)\)/)[1];
    //exmpty url or does not
    if (
      link.trim() === "" ||
      (!link.startsWith("http://") && !link.startsWith("https://"))
    ) {
      return true;
    }
  }
  return false;
}
