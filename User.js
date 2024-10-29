// models/User.js
class User {
  constructor(username, password) {
      this.username = username;
      this.password = password; // Consider hashing for security
  }
}

// Dummy user data for testing
const dummyUsers = [
  new User('testUser', 'testPassword'), // Dummy credentials
  new User('admin', 'adminPassword'), // Another dummy user
];

// Function to find a user by username
const findUserByUsername = (username) => {
  return dummyUsers.find(user => user.username === username);
};

module.exports = { User, findUserByUsername };

