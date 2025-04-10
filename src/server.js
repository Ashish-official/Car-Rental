require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); // Load environment variables from root .env file
const app = require('./app');
const mongoose = require('mongoose');
const constants = require('./config/constants');

const startServer = async (port) => {
  try {
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
mongoose.connect(constants.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server after successful database connection
    const PORT = process.env.PORT || 3001;
    startServer(PORT);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });