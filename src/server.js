const app = require('./app');
const connectDB = require('./config/database');
const PORT = process.env.PORT || 5001;
require('dotenv').config(); // Load environment variables from .env file
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});