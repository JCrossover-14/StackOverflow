// Application server

// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

//require env jwt secret
//require("dotenv").config({ path: __dirname + "/../.env" });
//console.log(process.env.JWT_SECRET);

//console.log("test");
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cors = require("cors");

// Models
const Question = require("./models/questions.js");
const Tags = require("./models/tags.js");
const Answers = require("./models/answers.js");
const User = require("./models/users.js");

const app = express();
const mongoDB = "mongodb://127.0.0.1/fake_so";

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Session configuration
app.use(
  session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

app.use(express.json());

//testing route
app.get("/", function (req, res) {
  res.send("Hello World!");
});

//route for questions
app.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

app.get("/tags", async (req, res) => {
  try {
    const tag = await Tags.find();
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

app.get("/answers", async (req, res) => {
  try {
    const answer = await Answers.find();
    res.json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

//define routes to post
app.post("/questions", async (req, res) => {
  console.log(req.body);
  try {
    const question = new Question(req.body);
    await question.save();
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/tags", async (req, res) => {
  try {
    const tag = new Tags(req.body);
    await tag.save();
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/answers", async (req, res) => {
  try {
    const answer = new Answers(req.body);
    await answer.save();
    res.json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.put("/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.put("/questions/:id/increment-views", async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).send("Question not found");
    }
    //increment view count
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//routes here for users

app.post("/register", async (req, res) => {
  try {
    //check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email.");
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      passwordHash,
    });

    //save the user
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", userId: savedUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in registering new user");
  }
});

app.get("/register", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password.");
    }

    // Set user info in session
    req.session.userId = user._id;
    req.session.user = { email: user.email, username: user.username }; // Store user data
    res.status(200).send("Logged in successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in user login");
  }
});

// Example modification in the /userInfo route
app.get("/userInfo", async (req, res) => {
  if (req.session.user) {
    try {
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      // Include the user's role in the response
      res.json({
        email: user.email,
        username: user.username,
        id: user._id,
        role: user.role,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  } else {
    res.status(401).send("No active session");
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json({
      username: user.username,
      reputation: user.reputation,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal server error");
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).send("Error during logout");
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.send("Logged out successfully");
  });
});

app.put("/questions/:id/upvote", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).send("Question not found");
    }

    question.votes += 1;
    await question.save();

    // Assuming the 'asked_by' field is a user ID
    const user = await User.findById(question.asked_by);
    if (user) {
      user.reputation += 5; // Increment user reputation by 5
      await user.save();
    }

    res.json(question);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Downvote a question
app.put("/questions/:id/downvote", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).send("Question not found");
    }

    question.votes -= 1; // Decrement the vote
    await question.save();

    const user = await User.findById(question.asked_by);
    if (user) {
      user.reputation -= 10; // Decrement user reputation by 10
      await user.save();
    }

    res.json(question);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Upvote an answer
app.put("/answers/:id/upvote", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).send("Answer not found");
    }

    answer.votes += 1;
    await answer.save();

    const user = await User.findById(answer.ans_by);
    if (user) {
      user.reputation += 5;
      await user.save();
    }

    res.json(answer);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Downvote an answer
app.put("/answers/:id/downvote", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).send("Answer not found");
    }

    answer.votes -= 1;
    await answer.save();

    const user = await User.findById(answer.ans_by);
    if (user) {
      user.reputation -= 10;
      await user.save();
    }

    res.json(answer);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.get("/questions/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const questions = await Question.find({ asked_by: userId });
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions for user:", error);
    res.status(500).send("Internal server error");
  }
});

app.delete("/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the question
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).send("Question not found");
    }

    // Get all remaining questions to check if the tags are still in use
    const remainingQuestions = await Question.find();
    const remainingTagsSet = new Set();
    remainingQuestions.forEach((q) =>
      q.tags.forEach((tag) => remainingTagsSet.add(tag.toString()))
    );

    // Check each tag in the deleted question
    for (const tagId of question.tags) {
      if (!remainingTagsSet.has(tagId.toString())) {
        // If the tag is not found in any remaining questions, delete it
        await Tags.findByIdAndDelete(tagId);
      }
    }

    res.send("Question deleted successfully");
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).send("Internal server error");
  }
});

app.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //find
    const userQuestions = await Question.find({ asked_by: userId });
    for (const question of userQuestions) {
      //delete answers
      await Answers.deleteMany({ _id: { $in: question.answers } });
      //delete question itself
      await Question.findByIdAndDelete(question._id);

      // tags of questions
      for (const tagId of question.tags) {
        const associatedQuestions = await Question.find({ tags: tagId });
        if (associatedQuestions.length === 0) {
          // If no other questions are associated, delete the tag
          await Tags.findByIdAndDelete(tagId);
        }
      }
    }

    // delete user
    await User.findByIdAndDelete(userId);

    res.send("User and associated data deleted successfully");
  } catch (error) {
    console.error("Error deleting user and related data:", error);
    res.status(500).send("Internal server error");
  }
});

//start server here
const server = app.listen(8000, () => {
  console.log("Server started at http://localhost:8000");
});

// SIGINT signal handler
process.on("SIGINT", function () {
  server.close(() => {
    console.log("Server closed.");
    //removed callback use promise
    mongoose.connection
      .close()
      .then(() => {
        console.log("MongoDB disconnected on app termination");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Error during disconnection", error);
        process.exit(1);
      });
  });
});
