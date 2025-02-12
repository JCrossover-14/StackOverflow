const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Models
const Tag = require("./models/tags");
const Answer = require("./models/answers");
const Question = require("./models/questions");
const User = require("./models/users");

// Hardcoded MongoDB URL
const mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let userArgs = process.argv.slice(2);
const adminUsername = userArgs[0]; // Admin's email
const adminPassword = userArgs[1]; // Admin's password

async function userCreate(
  username,
  email,
  password,
  isAdmin = false,
  reputation = 0
) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    passwordHash,
    role: isAdmin ? "admin" : "user",
    reputation: reputation,
  });
  return user.save();
}

async function tagCreate(name) {
  let tag = new Tag({ name });
  return tag.save();
}

async function answerCreate(text, ans_by) {
  let answer = new Answer({ text, ans_by });
  return answer.save();
}

async function questionCreate(title, summary, text, tags, answers, asked_by) {
  let question = new Question({
    title,
    summary,
    text,
    tags,
    answers,
    asked_by,
  });
  return question.save();
}

async function createInitialData() {
  try {
    // Create admin user with 1000 reputation
    let admin = await userCreate(
      "Admin",
      adminUsername,
      adminPassword,
      true,
      1000
    );

    // Create predefined users with random reputations
    let user1 = await userCreate(
      "Jason",
      "jason@gmail.com",
      "hello",
      false,
      Math.floor(Math.random() * 100)
    );
    let user2 = await userCreate(
      "Samson",
      "samson@gmail.com",
      "hello",
      false,
      Math.floor(Math.random() * 100)
    );
    let user3 = await userCreate(
      "Kevin",
      "kevin@gmail.com",
      "hello",
      false,
      Math.floor(Math.random() * 100)
    );
    let user4 = await userCreate(
      "Mike",
      "mike@gmail.com",
      "hello",
      false,
      Math.floor(Math.random() * 100)
    );
    let user5 = await userCreate(
      "John",
      "john@gmail.com",
      "hello",
      false,
      Math.floor(Math.random() * 100)
    );
    let user6 = await userCreate(
      "Jack",
      "jack@gmail.com",
      "hello",
      false,
      Math.floor(Math.random() * 100)
    );
    let user7 = await userCreate(
      "Alice",
      "alice@gmail.com",
      "hello",
      false,
      Math.floor(Math.random() * 100)
    );

    let tagReact = await tagCreate("react");
    let tagJavaScript = await tagCreate("javascript");
    let tagJava = await tagCreate("java");
    let tagPython = await tagCreate("python");
    let tagC = await tagCreate("c");
    let tagBugs = await tagCreate("bugs");
    let tagOtherLanguages = await tagCreate("other_languages");

    let answer1 = await answerCreate(
      "This is an answer to a React question.",
      user1._id
    );
    let answer2 = await answerCreate(
      "This is an answer to a JavaScript question.",
      user2._id
    );

    await questionCreate(
      "React Question Title",
      "Question about React",
      "How do I use React Router?",
      [tagReact._id],
      [answer1._id],
      user1._id
    );

    await questionCreate(
      "JavaScript Question Title",
      "Question about JavaScript",
      "How do I use async/await in JavaScript?",
      [tagJavaScript._id],
      [answer2._id],
      user2._id
    );

    // Predefined questions and answers
    let answerPythonInstall = await answerCreate(
      "You can download Python 3 from the official website and follow the installation instructions.",
      user3._id
    );
    let answerPythonIssue = await answerCreate(
      "Make sure you add Python to your PATH during installation.",
      user4._id
    );

    await questionCreate(
      "Need help with installing Python 3",
      "Installation issues",
      "I'm trying to install Python 3 on my Windows machine, but I'm facing issues.",
      [tagPython._id],
      [answerPythonInstall._id, answerPythonIssue._id],
      user5._id
    );

    let answerJava1 = await answerCreate(
      "You should check your classpath settings.",
      user6._id
    );
    let answerJava2 = await answerCreate(
      "Ensure JDK is properly installed and your IDE is configured correctly.",
      user7._id
    );

    await questionCreate(
      "Java compilation error",
      "Compile-time error",
      "I'm getting a compilation error when trying to run a simple Java program. Any suggestions?",
      [tagJava._id],
      [answerJava1._id, answerJava2._id],
      user3._id
    );

    // Scenario: C Programming Challenge
    let answerC1 = await answerCreate(
      "Check your pointer usage, it might be causing memory leaks.",
      user1._id
    );
    let answerC2 = await answerCreate(
      "Make sure you're using malloc and free correctly.",
      user2._id
    );

    await questionCreate(
      "Memory management in C",
      "Handling memory",
      "How do I manage memory effectively in C? I'm facing issues with segmentation faults.",
      [tagC._id],
      [answerC1._id, answerC2._id],
      user4._id
    );

    // Scenario: Debugging a bug
    let answerBugs1 = await answerCreate(
      "Have you tried using a debugger to step through your code?",
      user5._id
    );
    let answerBugs2 = await answerCreate(
      "Sometimes print statements in strategic locations can help.",
      user6._id
    );

    await questionCreate(
      "Debugging strategies",
      "Finding and fixing bugs",
      "What are some effective strategies for debugging complex code?",
      [tagBugs._id],
      [answerBugs1._id, answerBugs2._id],
      user7._id
    );

    // Scenario: Learning new programming languages
    let answerOtherLang1 = await answerCreate(
      "Start with the official documentation and a good book.",
      user3._id
    );
    let answerOtherLang2 = await answerCreate(
      "Online courses can be very helpful in learning new languages.",
      user4._id
    );

    await questionCreate(
      "Best approach to learn new programming languages",
      "Learning new skills",
      "What's the best approach to start learning a new programming language?",
      [tagOtherLanguages._id],
      [answerOtherLang1._id, answerOtherLang2._id],
      user1._id
    );

    console.log("Initial data created");
  } catch (error) {
    console.error("Error creating initial data:", error);
  } finally {
    db.close();
  }
}

createInitialData();
