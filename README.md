
## Instructions to setup and run project

## Installation

Before running the project, you need to install the necessary libraries in the respective directories.

### Client Directory
Run the following commands in the client directory:
- npm install axios
- npm install cors
- npm install react

### Server Directory
Run the following commands in the server directory:
- npm install express
- npm install mongoose
- npm install nodemon
- npm install bcryptjs
- npm install express-session
- npm install cors

## Running the Application

### Step 1: Initialize the Server
In the server directory, run the `init.js` script with the admin email and password as arguments. This starts a MongoDB instance at `mongodb://127.0.0.1:27017/fake_so`, which is hardcoded in the script.

Example command:
node init.js admin@gmail.com admin

This creates an admin account with the following credentials:
- Email: admin@gmail.com
- Password: admin

### Step 2: Start the Server
In the server directory, start the server using one of the following commands:
npx nodemon server.js
# Or
node server.js

### Step 3: Start the React Client
In a separate terminal, navigate to the client directory and start the React app:
npm start

## Additional Information

### Test Accounts
Several user accounts are created in the `init.js` script for testing purposes, or you can register a new account. All test accounts use the password `hello`:

- jason@gmail.com
- samson@gmail.com
- kevin@gmail.com
- mike@gmail.com
- alice@gmail.com
- jack@gmail.com
- john@gmail.com



