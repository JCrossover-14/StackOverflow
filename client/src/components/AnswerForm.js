import React, { useState, useEffect } from "react";
import { validLink } from "./QuestionForm.js";
import axios from "axios";

function AnswerForm({ question, onAnswerSubmitted }) {
  const [userId, setUserId] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [answerTextError, setAnswerTextError] = useState("");

  useEffect(() => {
    // Fetch user info from session
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8000/userInfo", {
          withCredentials: true,
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempAnswerTextError = "";
    let flag = 0;

    if (validLink(answerText)) {
      tempAnswerTextError =
        "Hyperlinks must be in the format [Name](http://link) or [Name](https://link)";
      flag = 1;
    }

    if (!answerText.trim()) {
      tempAnswerTextError = "Answer cannot be empty";
      flag = 1;
    }

    setAnswerTextError(tempAnswerTextError);

    if (!flag) {
      try {
        const newAnswer = {
          text: answerText,
          //use new userID
          ans_by: userId,
          question: question._id,
        };

        const answerResponse = await axios.post(
          "http://localhost:8000/answers",
          newAnswer
        );
        if (answerResponse.status === 200) {
          const newAnswerId = answerResponse.data._id;
          const updatedQuestion = {
            ...question,
            answers: [...question.answers, newAnswerId],
          };

          const updatedQuestionResponse = await axios.put(
            `http://localhost:8000/questions/${question._id}`,
            updatedQuestion
          );

          if (updatedQuestionResponse.status === 200) {
            onAnswerSubmitted(updatedQuestionResponse.data);
          }
        }
      } catch (error) {
        console.error("Error posting the answer:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Answer Text*</h2>
      <textarea
        id="answerTextInput"
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
      ></textarea>
      <p style={{ color: "red" }}>{answerTextError}</p>

      <div style={{ display: "flex" }}>
        <button type="submit" id="postAnswerButton">
          Post Answer
        </button>
        <p style={{ color: "red" }}>*indicates mandatory fields</p>
      </div>
    </form>
  );
}

export default AnswerForm;
