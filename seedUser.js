require('dotenv').config();

const defaultUser = {
  username: 'testuser',
  password: 'testpassword', // Use a plain password for testing
};

const seedUser = () => {
  console.log('Default user created:', defaultUser);
};

seedUser();

