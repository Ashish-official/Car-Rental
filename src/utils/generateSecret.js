const crypto = require('crypto');

// Generate a random string of specified length
const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate and display the secret
const secret = generateSecret();
console.log('\nGenerated JWT Secret Key:');
console.log('------------------------');
console.log(secret);
console.log('\nCopy this key and paste it in your .env file as JWT_SECRET=<key>'); 