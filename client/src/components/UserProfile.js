import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUserInfoAndQuestions = async () => {
      try {
        // Get the user info
        const userInfoResponse = await axios.get(
          "http://localhost:8000/userInfo",
          { withCredentials: true }
        );
        const userId = userInfoResponse.data.id;
        const role = userInfoResponse.data.role;
        setIsAdmin(role === "admin");

        // Fetch additional user details
        const userResponse = await axios.get(
          `http://localhost:8000/user/${userId}`
        );
        setUser(userResponse.data);

        if (role === "admin") {
          // If admin, fetch all users
          const allUsersResponse = await axios.get(
            "http://localhost:8000/register"
          );
          setAllUsers(allUsersResponse.data);
        } else {
          // Fetch questions asked by the user
          const questionsResponse = await axios.get(
            `http://localhost:8000/questions/user/${userId}`
          );
          setUserQuestions(questionsResponse.data);
        }
      } catch (error) {
        console.error(
          "Error fetching user info, user data, or questions:",
          error
        );
      }
    };

    fetchUserInfoAndQuestions();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Function to calculate membership duration
  const calculateMembershipDuration = (createdAt) => {
    const creationDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - creationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Less than a day";
    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

  const membershipDuration = calculateMembershipDuration(user.createdAt);

  const handleEditQuestion = (questionId) => {
    console.log("Edit Question ID:", questionId);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:8000/questions/${questionId}`);
      // Remove the question from userQuestions
      setUserQuestions(
        userQuestions.filter((question) => question._id !== questionId)
      );
      console.log("Question deleted:", questionId);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/users/${userId}`);
        setAllUsers(allUsers.filter((user) => user._id !== userId));
        console.log("User deleted:", userId);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div>
      <h2>User Profile: {user && user.username}</h2>
      {user && <p>Member for: {calculateMembershipDuration(user.createdAt)}</p>}
      {user && <p>Reputation: {user.reputation}</p>}

      {isAdmin ? (
        <div>
          <h3>All Users:</h3>
          {allUsers.length === 0 ? (
            <p>No users found in the system.</p>
          ) : (
            <ul>
              {allUsers.map((userItem) => (
                <li key={userItem._id}>
                  {userItem.username}
                  <button onClick={() => handleDeleteUser(userItem._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <h3>Questions Asked:</h3>
          <ul>
            {userQuestions.map((question) => (
              <li key={question._id}>
                {question.title}
                <button onClick={() => handleEditQuestion(question._id)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteQuestion(question._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
